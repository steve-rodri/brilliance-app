class NestedEmployeeSerializer < ActiveModel::Serializer
  attributes :id, :active?, :labor?, :rate_hand_per_job, :rate_full_job, :rate_on_premise_one_man, :rate_on_premise, :rate_hourly, :rate_hourly_office_shop, :rate_demo
  has_one :contact
end
