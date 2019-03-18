require 'csv'
Expense.destroy_all

#seed Expense
csv_text = File.read(Rails.root.join('lib','seeds', 'Expenses.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Expense.create! ({
    kind: row['type'],
    amount: row['amount'],
    reimbursement_type: row['reimbursement_type'],
    receipt: row['receipt'],
    paid: row['paid'],
    notes: row['notes'],
    employee_id: row['staff_id'],
    event_id: row['event_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Expense.count} rows in the Expenses table"
