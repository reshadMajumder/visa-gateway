import { Award, Clock, Users, Shield } from "lucide-react";

const features = [
    {
        icon: <Award className="h-10 w-10 text-primary" />,
        title: "Expert Guidance",
        description: "Our team of experienced visa consultants provides personalized advice to ensure your application is accurate and complete."
    },
    {
        icon: <Clock className="h-10 w-10 text-primary" />,
        title: "Efficient Process",
        description: "We streamline the visa application process with our user-friendly platform, saving you time and reducing stress."
    },
    {
        icon: <Users className="h-10 w-10 text-primary" />,
        title: "Comprehensive Support",
        description: "From initial consultation to final submission, we're with you every step of the way to answer questions and provide support."
    },
    {
        icon: <Shield className="h-10 w-10 text-primary" />,
        title: "Success & Reliability",
        description: "With a high success rate, we are a trusted partner for thousands of travelers worldwide, ensuring a reliable service."
    }
];

export function WhyChooseUs() {
    return (
        <section className="py-12 bg-secondary/30">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-headline font-bold">Why Choose Schengen visa gateway?</h2>
                    <p className="mt-2 text-lg text-muted-foreground">Your trusted partner for seamless international travel.</p>
                </div>
                <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="text-center p-6 bg-card border rounded-lg">
                            <div className="flex items-center justify-center h-16 w-16 bg-primary/10 mx-auto mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-headline font-semibold">{feature.title}</h3>
                            <p className="mt-2 text-muted-foreground text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
