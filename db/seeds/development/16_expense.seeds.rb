# Expense.destroy_all
#
# seed Expense
#
# Expense.create! ({
#   kind: row['type'],
#   amount: row['amount'],
#   reimbursement_type: row['reimbursement_type'],
#   receipt: row['receipt'],
#   paid: row['paid'],
#   notes: row['notes'],
#   employee_id: row['staff_id'],
#   event_id: row['event_id'],
#   created_at: row['created_at']
# })

puts "There are now #{Expense.count} rows in the Expenses table"
