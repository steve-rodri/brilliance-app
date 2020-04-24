class Employee < ApplicationRecord
  belongs_to :contact
  has_many :event_employees, dependent: :destroy
  has_many :events, through: :event_employees
  accepts_nested_attributes_for :contact

  def self.search(params)
    if params[:email]
      find_by_email(params)
    elsif params[:q]
      find_by_query(params)
    else
      where(params)
    end
  end

  def find_by_query(params)
    params[:q] = "%#{params[:q]}%"
    query = "(contacts.first_name LIKE :q OR
     contacts.last_name LIKE :q OR
     email_addresses.email_address LIKE :q)
     AND active = :active AND labor = :labor
    "

    joins(:contact, contact: :email_addresses)
    if params[:active] == nil
      where(query, params).unscope(where: :active)
    elsif params[:labor] == nil
      where(query, params).unscope(where: :labor)
    else
      where(query, params)
    end
  end

  def find_by_email(params)
    params[:email_address] = params[:email]
    params.delete(:email)

    joins(contact: :email_addresses)
    if params[:active] == nil
      where(params).unscope(where: :active)
    end
    if params[:labor] == nil
      where(params).unscope(where: :labor)
    else
      where(params)
    end
  end
end
