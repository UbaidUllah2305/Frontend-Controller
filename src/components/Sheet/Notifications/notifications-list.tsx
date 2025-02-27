import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import BlurFade  from '@/components/ui/blur-fade';

const notifications = [
  {
    title: 'Laiba Sent you a Leave Request.',
    description: '30 minutes ago',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    fallback: 'LS',
  },
  {
    title: 'Ayesha has accepted your invitation to join the team.',
    description: '1 hour ago',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=3276&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    fallback: 'AA',
  },
];
const NotificationsList = () => {
  return (
    <ScrollArea className="pt-6 h-screen">
      {notifications.map((notification, index) => (
        <BlurFade delay={0.25} inView className="py-2" key={index}>
          <div className="mb-1 items-start pb-2">
            <div className="inline-flex items-center justify-center gap-2">
              <Avatar className="rounded-md">
                <AvatarImage
                  src={notification.image}
                  className="object-cover"
                  alt="Avatar"
                />
                <AvatarFallback className="rounded-lg">
                  {notification.fallback}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col h-full">
                <Label className="text-sm font-normal">
                  {notification.title}
                </Label>
                <span className="text-sm text-muted-foreground">
                  {notification.description}
                </span>
              </div>
            </div>
            <div className="flex justify-center items-center my-1">
              <Separator className="h-0.5 w-16 bg-secondary" />
            </div>
          </div>
        </BlurFade>
      ))}
    </ScrollArea>
  );
};

export default NotificationsList;
