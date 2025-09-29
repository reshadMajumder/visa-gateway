import { Building, Globe, Users, Linkedin, Heart, Lightbulb, Shield } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const teamMembers = [
  {
    name: "Jane Doe",
    role: "Founder & CEO",
    avatar: "https://i.pravatar.cc/150?u=jane_doe",
    social: {
      linkedin: "#"
    },
  },
  {
    name: "John Smith",
    role: "Head of Visa Operations",
    avatar: "https://i.pravatar.cc/150?u=john_smith",
    social: {
      linkedin: "#"
    },
  },
  {
    name: "Emily White",
    role: "Lead Tech Architect",
    avatar: "https://i.pravatar.cc/150?u=emily_white",
    social: {
      linkedin: "#"
    },
  },
  {
    name: "Michael Brown",
    role: "Senior Visa Consultant",
    avatar: "https://i.pravatar.cc/150?u=michael_brown",
    social: {
      linkedin: "#"
    },
  }
];

const coreValues = [
    {
        icon: <Heart className="h-8 w-8 text-primary"/>,
        title: "Customer Centric",
        description: "We prioritize our clients' needs, ensuring a smooth and personalized experience from start to finish."
    },
    {
        icon: <Lightbulb className="h-8 w-8 text-primary"/>,
        title: "Innovation",
        description: "We leverage technology to simplify complex processes, making travel more accessible for everyone."
    },
    {
        icon: <Shield className="h-8 w-8 text-primary"/>,
        title: "Integrity",
        description: "We operate with transparency and honesty, building trust with our clients and partners."
    }
]

export default function AboutPage() {
  const teamImage = PlaceHolderImages.find(p => p.id === "team");
  return (
    <div className="py-8 space-y-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">About Schengen visa gateway</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your trusted partner in navigating the world of visas.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-16">
        <div className="relative h-80 w-full rounded-lg overflow-hidden">
          {teamImage && 
            <Image 
              src={teamImage.imageUrl}
              alt={teamImage.description}
              fill
              className="object-cover"
              data-ai-hint={teamImage.imageHint}
            />
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-8">
            <h2 className="text-3xl font-headline font-bold text-white">Our Mission</h2>
            <p className="mt-2 text-white/90 max-w-2xl">
              To simplify the visa application process and empower travelers to explore the world with confidence.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-card rounded-lg border">
                <Users className="h-10 w-10 text-primary mx-auto mb-4"/>
                <h3 className="text-xl font-headline font-semibold">Who We Are</h3>
                <p className="mt-2 text-muted-foreground">
                    We are a team of experienced travel experts and technologists passionate about breaking down barriers to international travel.
                </p>
            </div>
            <div className="p-6 bg-card rounded-lg border">
                <Globe className="h-10 w-10 text-primary mx-auto mb-4"/>
                <h3 className="text-xl font-headline font-semibold">What We Do</h3>
                <p className="mt-2 text-muted-foreground">
                    We provide up-to-date visa requirement information, a smart itinerary planner, and expert consultation services.
                </p>
            </div>
            <div className="p-6 bg-card rounded-lg border">
                <Building className="h-10 w-10 text-primary mx-auto mb-4"/>
                <h3 className="text-xl font-headline font-semibold">Why Choose Us</h3>
                <p className="mt-2 text-muted-foreground">
                    Our platform is designed for clarity and ease of use, saving you time and reducing the stress of planning your travels.
                </p>
            </div>
        </div>

        <div>
            <h2 className="text-3xl font-headline font-bold mb-8 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {coreValues.map((value) => (
                    <div key={value.title} className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 mt-1">
                           {value.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-headline font-semibold">{value.title}</h3>
                            <p className="mt-1 text-muted-foreground">{value.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>


        <div>
            <h2 className="text-3xl font-headline font-bold mb-8 text-center">Meet Our Experts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member) => (
                    <Card key={member.name} className="text-center">
                        <CardContent className="p-6 flex flex-col items-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-lg font-headline font-semibold">{member.name}</h3>
                            <p className="text-primary text-sm font-medium">{member.role}</p>
                             <Link href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 text-muted-foreground hover:text-primary">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
