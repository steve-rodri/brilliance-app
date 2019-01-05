class AddClientToEvents < ActiveRecord::Migration[5.2]
  def change
    add_reference :events, :client, foreign_key: true
  end
end
