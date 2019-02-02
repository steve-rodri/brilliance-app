class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :action
      t.string :break
      t.datetime :break_start
      t.datetime :call_time
      t.datetime :clock_out
      t.string :confirmation, default: 'Unconfirmed'
      t.string :creator
      t.string :description
      t.string :driving_time
      t.datetime :end
      t.string :gc_id
      t.string :html_link
      t.string :kind
      t.text :notes
      t.datetime :start
      t.string :summary
      t.string :tags

      t.timestamps
    end
  end
end

#Google Calendar Integration

#Seperate Table issues---------------

# attendees: Array(2)
# 0: {email: "steve@brilliancepro.com", organizer: true, self: true, responseStatus: "accepted"}
# 1: {email: "steve@brilliancepro.com", responseStatus: "needsAction"}

# location: "948 Mirabelle Ave, Westbury, NY 11590, USA"

#--------------------------------------


# Formatting issues-----------------------------

# end: "2012-09-06T00:00:00.000Z"
# end: {dateTime: "2019-01-16T16:30:00-05:00"}

# start: "2012-09-06T00:00:00.000Z"
# start: {dateTime: "2019-01-16T13:30:00-05:00"}

# creator: {email: "steve@brilliancepro.com"}

# created_at: "2019-01-08T15:03:03.024Z"
# created: "2019-01-08T02:44:48.000Z"

# updated_at: "2019-01-08T15:03:03.024Z"
# updated: "2019-01-08T02:44:48.255Z"

#--------------------------------------------------
