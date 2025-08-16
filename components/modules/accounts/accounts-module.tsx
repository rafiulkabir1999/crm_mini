"use client"

import { useState } from "react"
import type { Expense } from "@/lib/types"
import { mockAccountsSummary, mockExpenses } from "@/lib/mock-data"
import { AccountsSummaryCards } from "./accounts-summary-cards"
import { IncomeExpenseChart } from "./income-expense-chart"
import { ExpenseEntryForm } from "./expense-entry-form"
import { useToast } from "@/hooks/use-toast"

export function AccountsModule() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [summary, setSummary] = useState(mockAccountsSummary)
  const { toast } = useToast()

  const handleExpenseAdded = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev])

    // Update summary with new expense
    const newTotalExpenses = summary.totalExpenses + newExpense.amount
    const newNetProfit = summary.totalIncome - newTotalExpenses

    setSummary((prev) => ({
      ...prev,
      totalExpenses: newTotalExpenses,
      netProfit: newNetProfit,
    }))

    toast({
      title: "Expense added",
      description: `${newExpense.description} - $${newExpense.amount.toFixed(2)}`,
    })
  }

  return (
    <div className="space-y-6">
      <AccountsSummaryCards summary={summary} />

      <div className="grid gap-6 md:grid-cols-2">
        <IncomeExpenseChart summary={summary} />
        <ExpenseEntryForm onExpenseAdded={handleExpenseAdded} />
      </div>
    </div>
  )
}
