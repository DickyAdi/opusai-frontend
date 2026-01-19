'use client'

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFont, useSetFont, useSetTheme, useTheme } from "@/hooks/useTheme";
import { useMemo } from "react";



export default function SettingsGeneralPage() {
  const availableTheme = ["dark", "light", "nord", "dracula", 'solarized', "monokai"] as const
  const availableFont = ["Geist", "Inter"] as const
  const setTheme = useSetTheme()
  const currentTheme = useTheme()
  const currentFont = useFont()
  const setFont = useSetFont()
  const renderedTheme = useMemo(() => {
    return availableTheme.map((theme, index) => (
      <Button key={index} variant={currentTheme === theme ? "default" : "outline"} onClick={() => setTheme(theme)} className="capitalize mx-1">{theme}</Button>
    ))
  }, [availableTheme, currentTheme, setTheme])
  const renderedFont = useMemo(() => {
    return availableFont.map((font, index) => (
      <Button key={index} variant={currentFont === font? "default" : "outline"} onClick={() => setFont(font)} className={"capitalize "+"!"+font.toLocaleLowerCase()}>{font}</Button>
    ))
  }, [availableFont, setFont, currentFont])
  
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold py-2">Appearance</h1>
      <Separator/>
      <div className="grid grid-cols-7 gap-4 mt-4">
        <div className="col-span-4">
          <div className="flex flex-col border-r">
            <p className="text-base">Color mode</p>
            <div className="flex flex-row flex-wrap py-2 gap-1">
              {renderedTheme}
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="flex flex-col">
            <p className="text-base">Font selection</p>
            <div className="flex flex-row flex-wrap py-2 gap-1">
              {renderedFont}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}