// hooks/useContract.ts
"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { contractABI, contractAddress } from "@/lib/contract"

export interface ExpenseData {
  item: string
  amount: string
  timestamp: number
}

export interface ContractData {
  totalSpent: string
  expenseCount: number
  expenses: ExpenseData[]
}

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
}

export interface ContractActions {
  addExpense: (item: string, amount: string) => Promise<void>
}

export const useExpenseContract = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [expenses, setExpenses] = useState<ExpenseData[]>([])

  const { data: totalSpent, refetch: refetchTotalSpent } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "totalSpent",
  })

  const { data: expenseCount, refetch: refetchExpenseCount } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getExpenseCount",
  })

  const { writeContractAsync, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isConfirmed) {
      refetchTotalSpent()
      refetchExpenseCount()
    }
  }, [isConfirmed, refetchTotalSpent, refetchExpenseCount])

  const addExpense = async (item: string, amount: string) => {
    if (!item || !amount) return

    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "addExpense",
        args: [item, BigInt(amount)],
      })
    } catch (err) {
      console.error("Error adding expense:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const data: ContractData = {
    totalSpent: totalSpent ? String(totalSpent) : "0",
    expenseCount: expenseCount ? Number(expenseCount) : 0,
    expenses,
  }

  const actions: ContractActions = {
    addExpense,
  }

  const state: ContractState = {
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }

  return {
    data,
    actions,
    state,
  }
}
