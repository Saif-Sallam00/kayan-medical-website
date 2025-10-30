import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import type { Testimonial } from "@shared/schema";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full" data-testid={`card-testimonial-${testimonial.id}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={testimonial.photoUrl} alt={testimonial.doctorName} />
            <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
              {testimonial.doctorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold text-base" data-testid={`text-doctor-name-${testimonial.id}`}>
              {testimonial.doctorName}
            </h4>
            <p className="text-sm text-muted-foreground">{testimonial.specialization}</p>
          </div>
        </div>

        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
            />
          ))}
        </div>

        <p className="text-muted-foreground leading-relaxed mb-4 font-['Tajawal'] text-base">
          "{testimonial.quote}"
        </p>

        <p className="text-sm text-muted-foreground font-medium">
          {testimonial.clinicName}
        </p>
      </CardContent>
    </Card>
  );
}
