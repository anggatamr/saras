"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertOctagon, RotateCcw } from "lucide-react"
import { Button } from "./button"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-background min-h-[400px]">
          <div className="border-4 border-foreground bg-red-200 p-8 neo-shadow max-w-lg rounded-none">
            <div className="flex justify-center mb-6">
              <div className="border-2 border-foreground bg-background p-3 rounded-none neo-shadow-sm flex items-center justify-center h-14 w-14">
                <AlertOctagon className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h2 className="text-xl font-black uppercase text-foreground mb-3">Terjadi Kesalahan Aplikasi</h2>
            
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-6">
              Terjadi error yang tidak terduga saat memuat bagian halaman ini.
            </p>

            {this.state.error && (
              <div className="bg-slate-900 border-2 border-foreground p-4 rounded-none font-mono text-left text-xs text-red-400 mb-6 overflow-x-auto max-h-[150px]">
                {this.state.error.toString()}
              </div>
            )}

            <Button
              onClick={this.handleReset}
              className="border-2 border-foreground bg-primary text-primary-foreground neo-shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider py-3 px-6 rounded-none transition-all"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Muat Ulang Halaman
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
