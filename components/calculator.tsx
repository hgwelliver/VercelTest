"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

type Operation = "+" | "-" | "×" | "÷" | null

export function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [operation, setOperation] = useState<Operation>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }, [display, waitingForOperand])

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
      return
    }

    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }, [display, waitingForOperand])

  const clear = useCallback(() => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }, [])

  const toggleSign = useCallback(() => {
    const value = parseFloat(display)
    if (value !== 0) {
      setDisplay(String(-value))
    }
  }, [display])

  const inputPercent = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }, [display])

  const performOperation = useCallback((nextOperation: Operation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(display)
    } else if (operation) {
      const currentValue = parseFloat(previousValue)
      let result: number

      switch (operation) {
        case "+":
          result = currentValue + inputValue
          break
        case "-":
          result = currentValue - inputValue
          break
        case "×":
          result = currentValue * inputValue
          break
        case "÷":
          result = inputValue !== 0 ? currentValue / inputValue : 0
          break
        default:
          result = inputValue
      }

      const resultString = Number.isFinite(result) 
        ? String(parseFloat(result.toPrecision(12))) 
        : "Error"
      setDisplay(resultString)
      setPreviousValue(resultString)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }, [display, previousValue, operation])

  const calculate = useCallback(() => {
    if (operation === null || previousValue === null) {
      return
    }

    const inputValue = parseFloat(display)
    const currentValue = parseFloat(previousValue)
    let result: number

    switch (operation) {
      case "+":
        result = currentValue + inputValue
        break
      case "-":
        result = currentValue - inputValue
        break
      case "×":
        result = currentValue * inputValue
        break
      case "÷":
        result = inputValue !== 0 ? currentValue / inputValue : 0
        break
      default:
        result = inputValue
    }

    const resultString = Number.isFinite(result) 
      ? String(parseFloat(result.toPrecision(12))) 
      : "Error"
    setDisplay(resultString)
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(true)
  }, [display, previousValue, operation])

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event

      if (key >= "0" && key <= "9") {
        event.preventDefault()
        inputDigit(key)
      } else if (key === ".") {
        event.preventDefault()
        inputDecimal()
      } else if (key === "+" || key === "-") {
        event.preventDefault()
        performOperation(key as Operation)
      } else if (key === "*") {
        event.preventDefault()
        performOperation("×")
      } else if (key === "/") {
        event.preventDefault()
        performOperation("÷")
      } else if (key === "Enter" || key === "=") {
        event.preventDefault()
        calculate()
      } else if (key === "Escape" || key === "c" || key === "C") {
        event.preventDefault()
        clear()
      } else if (key === "Backspace") {
        event.preventDefault()
        if (display.length > 1) {
          setDisplay(display.slice(0, -1))
        } else {
          setDisplay("0")
        }
      } else if (key === "%") {
        event.preventDefault()
        inputPercent()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [inputDigit, inputDecimal, performOperation, calculate, clear, inputPercent, display])

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        {/* Display */}
        <div className="bg-primary p-6">
          <div className="text-right">
            <div className="text-primary-foreground/60 text-sm h-5 truncate">
              {previousValue !== null && operation !== null 
                ? `${previousValue} ${operation}` 
                : ""}
            </div>
            <div 
              className="text-primary-foreground text-4xl font-light truncate"
              aria-live="polite"
              role="status"
            >
              {display}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-px bg-border p-px">
          <CalcButton onClick={clear} variant="function">AC</CalcButton>
          <CalcButton onClick={toggleSign} variant="function">+/-</CalcButton>
          <CalcButton onClick={inputPercent} variant="function">%</CalcButton>
          <CalcButton 
            onClick={() => performOperation("÷")} 
            variant="operator"
            active={operation === "÷" && waitingForOperand}
          >
            ÷
          </CalcButton>

          <CalcButton onClick={() => inputDigit("7")}>7</CalcButton>
          <CalcButton onClick={() => inputDigit("8")}>8</CalcButton>
          <CalcButton onClick={() => inputDigit("9")}>9</CalcButton>
          <CalcButton 
            onClick={() => performOperation("×")} 
            variant="operator"
            active={operation === "×" && waitingForOperand}
          >
            ×
          </CalcButton>

          <CalcButton onClick={() => inputDigit("4")}>4</CalcButton>
          <CalcButton onClick={() => inputDigit("5")}>5</CalcButton>
          <CalcButton onClick={() => inputDigit("6")}>6</CalcButton>
          <CalcButton 
            onClick={() => performOperation("-")} 
            variant="operator"
            active={operation === "-" && waitingForOperand}
          >
            −
          </CalcButton>

          <CalcButton onClick={() => inputDigit("1")}>1</CalcButton>
          <CalcButton onClick={() => inputDigit("2")}>2</CalcButton>
          <CalcButton onClick={() => inputDigit("3")}>3</CalcButton>
          <CalcButton 
            onClick={() => performOperation("+")} 
            variant="operator"
            active={operation === "+" && waitingForOperand}
          >
            +
          </CalcButton>

          <CalcButton onClick={() => inputDigit("0")} className="col-span-2">0</CalcButton>
          <CalcButton onClick={inputDecimal}>.</CalcButton>
          <CalcButton onClick={calculate} variant="operator">=</CalcButton>
        </div>
      </div>
      
      {/* Keyboard hint */}
      <p className="text-center text-muted-foreground text-xs mt-4">
        Keyboard supported: 0-9, +, -, *, /, Enter, Esc
      </p>
    </div>
  )
}

interface CalcButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: "number" | "operator" | "function"
  active?: boolean
  className?: string
}

function CalcButton({ 
  children, 
  onClick, 
  variant = "number", 
  active = false,
  className 
}: CalcButtonProps) {
  const baseStyles = "h-16 text-xl font-medium transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  
  const variantStyles = {
    number: "bg-card text-card-foreground hover:bg-secondary",
    operator: cn(
      "text-primary-foreground",
      active 
        ? "bg-primary-foreground text-primary" 
        : "bg-accent hover:bg-accent/80"
    ),
    function: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  }

  return (
    <button
      onClick={onClick}
      className={cn(baseStyles, variantStyles[variant], className)}
      type="button"
    >
      {children}
    </button>
  )
}
