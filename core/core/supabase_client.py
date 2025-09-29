from supabase import create_client
import os
import uuid
import mimetypes
from pathlib import Path

# NOTE: Env var name kept as-is to match existing project configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://sbkpzuzuobfsibbsgehq.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNia3B6dXp1b2Jmc2liYnNnZWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM5MDUsImV4cCI6MjA3MDE0OTkwNX0.xBFREBPWWfuwGRn_bvZBvyqVQ1ul90fWoYOwga4DjnU")  # Use service role key for upload access

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def _generate_unique_filename(original_name: str) -> str:
    ext = Path(original_name).suffix or ""
    return f"{uuid.uuid4().hex}{ext}"


def upload_file_to_supabase(file, folder="uploads", bucket="visa"):
    """Upload a file to Supabase storage ensuring unique path and return its public URL."""
    # Read file content once
    file_content = file.read()
    # Determine content type
    content_type = getattr(file, "content_type", None) or mimetypes.guess_type(getattr(file, "name", ""))[0] or "application/octet-stream"

    # Always generate a unique filename to avoid 409 conflicts
    unique_name = _generate_unique_filename(getattr(file, "name", "uploaded-file"))
    path = f"{folder}/{unique_name}"

    # Try upload with upsert support when available
    try:
        supabase.storage.from_(bucket).upload(
            path,
            file_content,
            {"content-type": content_type, "x-upsert": "true"}
        )
    except Exception as e:
        # If duplicate or any storage error still occurs, retry with a new name once
        try:
            unique_name_retry = _generate_unique_filename(getattr(file, "name", "uploaded-file"))
            path = f"{folder}/{unique_name_retry}"
            supabase.storage.from_(bucket).upload(
                path,
                file_content,
                {"content-type": content_type, "x-upsert": "true"}
            )
        except Exception as _:
            # Bubble up original error context
            raise e

    # Return public URL
    public_url = supabase.storage.from_(bucket).get_public_url(path)
    return public_url
