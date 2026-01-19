`use client`

import { Spinner } from "@/components/ui/spinner";
import {ChatConversation} from "../chat_conversation";
import { SidebarMenu } from "@/components/ui/sidebar";
import { useConversations, useFetchConversations, useIsFullyLoaded, useIsLoadingConv } from "@/hooks/useConversation";
import { ArrowDownFromLineIcon, ArrowUpFromLineIcon } from "lucide-react";
import { RefObject, useEffect, useRef } from "react";

export default function ChatSidebarContent({scrollContainer} : {scrollContainer:RefObject<HTMLDivElement | null>}) {
  const conversations = useConversations()
  const fetchConversations = useFetchConversations()
  const isFullyLoaded = useIsFullyLoaded()
  const isLoading = useIsLoadingConv()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    if (conversations.length === 0 && !isLoading) {
      fetchConversations()
    }
  }, [])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (isLoading || isFullyLoaded || !loadMoreRef.current) return

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchConversations()
      }
    }, {root:scrollContainer.current, threshold:1.0, rootMargin:'100px'})

    observerRef.current.observe(loadMoreRef.current)
    return () => observerRef.current?.disconnect()
  }, [fetchConversations])


  return (
    <SidebarMenu className="px-2 py-0">
      {conversations.map((e) => (
        <ChatConversation key={e.id} id={e.id} title={e.title} createdAt={e.createdAt} />
      ))}

      {
        !isFullyLoaded ? (
          <div ref={loadMoreRef}>
            {isLoading? (<Spinner className="h-4 w-4 mx-auto"/>) : (<ArrowDownFromLineIcon className="mx-auto h-4 w-4"/>)}
          </div>
        ) :
        (
          <div>
            <ArrowUpFromLineIcon className="mx-auto h-4 w-4"/>
          </div>
        )
      }
    </SidebarMenu>
  );
}

