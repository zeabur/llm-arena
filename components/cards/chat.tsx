"use client"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent, CardHeader,
} from "@/components/ui/card"

export function CardsChat(props: { messages: { role: string, content: string }[], title: string }) {
  const { messages } = props;

  return (
    <Card className="w-full h-full flex flex-col border-none rounded-none">
      <CardHeader>
        <div className="flex">
          <h2 className="text-sm font-bold flex-1 md:text-lg">{props.title}</h2>
        </div>
      </CardHeader>
      <CardContent className="absolute inset-0 pt-12 overflow-y-auto flex-1 pb-24">
        <div className="space-y-4 flex flex-col">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm text-wrap overflow-hidden",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {message.content.split('\n').map((line, index) => <p key={index}
              >{line}</p>)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
