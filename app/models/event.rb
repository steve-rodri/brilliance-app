class Event < ApplicationRecord
  belongs_to :client, optional: true
  has_one :invoice, dependent: :destroy
  belongs_to :place_location, class_name: 'Place', foreign_key: 'location_id', optional: true
  belongs_to :place_call_location, class_name: 'Place', foreign_key: 'call_location_id', optional: true
  belongs_to :contact_creator, class_name: 'Contact', foreign_key: 'creator_id', optional: true
  has_many :event_employees, dependent: :destroy do
    def create_or_update_by_email(params)
      worker = joins(employee: { contact: :email_addresses } ).find_by(
        "email_addresses.email_address LIKE :email",
        { email: "%#{params[:email].downcase}%" }
      )
      if worker
        worker.update(confirmation: params[:response_status])
      else
        email_address = EmailAddress.find_by(email_address: params[:email])
        if email_address
          email_address.update(notifications: true)
        else
          email_address = EmailAddress.create!(email_address: params[:email], notifications: true)
        end
        if email_address.contact
          if email_address.contact.employee
            employee = email_address.contact.employee
            create!(
              employee_id: employee[:id],
              confirmation: params[:response_status],
            )
          else
            employee = email_address.contact.create_employee!(active: true)
            create!(
              employee_id: employee[:id],
              confirmation: params[:response_status],
            )
          end
        else
          if params[:display_name]
            contact = Contact.create(
              first_name: params[:display_name].split(' ')[0],
              last_name: params[:display_name].split(' ')[1],
            )
            email_address.update(contact_id: contact[:id])
            employee = contact.create_employee!(active: true)
            create!(
              employee_id: employee[:id],
              confirmation: params[:response_status],
            )
          else
            contact = email_address.create_contact
            email_address.update(contact_id: contact[:id])
            employee = contact.create_employee!(active: true)
            create!(
              employee_id: employee[:id],
              confirmation: params[:response_status],
            )
          end
        end
      end
    end
  end
  has_many :employees, through: :event_employees
  has_many :expenses
  accepts_nested_attributes_for  :event_employees
end
