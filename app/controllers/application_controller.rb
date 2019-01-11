class ApplicationController < ActionController::API
  def execute_sql(sql)
    results = ActiveRecord::Base.connection.execute(sql)
    if results.present?
        return results
    else
        return nil
    end
  end
end
