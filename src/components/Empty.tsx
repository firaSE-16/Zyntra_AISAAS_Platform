import {  MessageSquare } from "lucide-react";

interface EmptyProps {
  label: string;
}

export const Empty = ({ label }: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <div className="flex items-center justify-center h-full w-full rounded-full bg-gray-100">
          <MessageSquare className="h-10 w-10 text-gray-500" />
        </div>
      </div>
      <p className="text-muted-foreground text-2xl text-center mt-4">
        {label}
      </p>
    </div>
  );
};