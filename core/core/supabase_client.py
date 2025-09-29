from supabase import create_client
import os
import uuid
import mimetypes
from pathlib import Path
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# NOTE: Env var name kept as-is to match existing project configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://sbkpzuzuobfsibbsgehq.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNia3B6dXp1b2Jmc2liYnNnZWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM5MDUsImV4cCI6MjA3MDE0OTkwNX0.xBFREBPWWfuwGRn_bvZBvyqVQ1ul90fWoYOwga4DjnU")  # Use service role key for upload access


def _strip_proxy_env() -> None:
    # Some environments set proxies that older httpx versions can't accept (proxy vs proxies)
    for var in [
        "HTTP_PROXY",
        "HTTPS_PROXY",
        "http_proxy",
        "https_proxy",
    ]:
        if var in os.environ:
            os.environ.pop(var, None)


def _get_supabase_client():
    try:
        _strip_proxy_env()
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        logger.warning("Supabase client init failed, will use local storage fallback. Reason: %s", str(e))
        return None


supabase = _get_supabase_client()


def _generate_unique_filename(original_name: str) -> str:
    ext = Path(original_name).suffix or ""
    return f"{uuid.uuid4().hex}{ext}"


def upload_file_to_supabase(file, folder="uploads", bucket="visa"):
    """Upload a file to Supabase storage; fallback to local MEDIA_ROOT on failure. Returns public URL."""
    # Read file content once
    file_content = file.read()
    # Determine content type
    content_type = getattr(file, "content_type", None) or mimetypes.guess_type(getattr(file, "name", ""))[0] or "application/octet-stream"

    # Always generate a unique filename to avoid 409 conflicts
    unique_name = _generate_unique_filename(getattr(file, "name", "uploaded-file"))
    rel_path = f"{folder}/{unique_name}"

    # Attempt Supabase upload if client is available
    if supabase is not None:
        try:
            supabase.storage.from_(bucket).upload(
                rel_path,
                file_content,
                {"content-type": content_type, "x-upsert": "true"}
            )
            public_url = supabase.storage.from_(bucket).get_public_url(rel_path)
            return public_url
        except Exception as e:
            logger.warning("Supabase upload failed, falling back to local storage. Reason: %s", str(e))

    # Fallback: save to local MEDIA_ROOT (optional)
    if os.getenv('DISABLE_LOCAL_UPLOAD_FALLBACK', '0') == '1' or os.getenv('VERCEL', '0') == '1':
        # On serverless (e.g., Vercel), the filesystem is read-only; do not fallback
        raise RuntimeError('Supabase upload failed and local fallback is disabled in this environment')

    try:
        media_root = getattr(settings, 'MEDIA_ROOT', None)
        media_url = getattr(settings, 'MEDIA_URL', '/media/')
        if not media_root:
            raise RuntimeError('MEDIA_ROOT is not configured')

        # Ensure folder exists
        target_dir = Path(media_root) / folder
        target_dir.mkdir(parents=True, exist_ok=True)

        # Write file
        target_path = target_dir / unique_name
        with open(target_path, 'wb') as f:
            f.write(file_content)

        # Build public URL
        public_url = f"{media_url.rstrip('/')}/{folder}/{unique_name}"
        return public_url
    except Exception as e:
        logger.error("Local storage fallback failed: %s", str(e))
        raise
