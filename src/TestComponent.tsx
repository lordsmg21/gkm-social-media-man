import React from 'react'

export function TestComponent() {
  const testData = {
    value: 42
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Test Component</h1>
      <p>Value: {testData.value}</p>
      <p>Formatted: {testData.value.toString()}</p>
    </div>
  )
}