// components/sample.tsx
"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useExpenseContract } from "@/hooks/useContract"

const SampleIntegration = () => {
  const { isConnected } = useAccount()

  const [item, setItem] = useState("")
  const [amount, setAmount] = useState("")

  const { data, actions, state } = useExpenseContract()

  const handleAddExpense = async () => {
    if (!item || !amount) return
    try {
      await actions.addExpense(item, amount)
      setItem("")
      setAmount("")
    } catch (err) {
      console.error("Error:", err)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-3">Grocery Budget Tracker</h2>
          <p>Please connect your wallet to interact with the contract.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Grocery Budget Tracker</h1>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <p className="text-sm">Total Spent:</p>
        <p className="text-2xl font-semibold">{data.totalSpent} units</p>
        <p className="mt-2 text-sm">Total Expenses Logged: {data.expenseCount}</p>
      </div>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Item name"
          className="w-full p-2 border rounded"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleAddExpense}
          disabled={state.isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {state.isLoading ? "Adding..." : "Add Expense"}
        </button>
      </div>

      {state.hash && (
        <div className="p-4 bg-gray-200 rounded text-sm break-all">
          <p className="font-semibold mb-1">Transaction Hash:</p>
          <p>{state.hash}</p>
          {state.isConfirming && <p className="text-blue-500">Confirming...</p>}
          {state.isConfirmed && <p className="text-green-600">Confirmed!</p>}
        </div>
      )}

      {state.error && (
        <div className="p-4 bg-red-200 rounded text-sm mt-4">
          <p>Error: {state.error.message}</p>
        </div>
      )}
    </div>
  )
}

export default SampleIntegration
