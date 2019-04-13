class EmployeeSerializer < ApplicationSerializer
  attributes :id, :active?, :labor?, :rates
  has_one :contact, key: 'contact_info'

  def rates
    {
      hand_per_job: object.rate_hand_per_job,
      full_job: object.rate_full_job,
      on_premise_one_man: object.rate_on_premise_one_man,
      on_premise: object.rate_on_premise,
      hourly: object.rate_hourly,
      hourly_office_shop: object.rate_hourly_office_shop,
      demo: object.rate_demo
    }
  end

end
