class EventEmployeesController < ApplicationController
  before_action :set_event_employee, only: [:show, :update, :destroy]

  # GET /event_employees
  def index
    @event_employees = EventEmployee.all

    render json: @event_employees, include: '**'
  end

  # GET /event_employees/1
  def show
    render json: @event_employee, include: '**'
  end

  # POST /event_employees
  def create
    @event_employee = EventEmployee.new(event_employee_params)

    if @event_employee.save
      render json: @event_employee, status: :created, location: @event_employee, include: '**'
    else
      render json: @event_employee.errors, status: :unprocessable_entity, include: '**'
    end
  end

  # PATCH/PUT /event_employees/1
  def update
    if @event_employee.update(event_employee_params)
      render json: @event_employee
    else
      render json: @event_employee.errors, status: :unprocessable_entity, include: '**'
    end
  end

  # DELETE /event_employees/1
  def destroy
    @event_employee.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_event_employee
      @event_employee = EventEmployee.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def event_employee_params
      params.require(:event_employee).permit(
        :confirmation,
        :paid?,
        :position,
        :rate,
        :clock_in,
        :clock_out,
        :break_minutes,
        :break?,
        :hourly?,
        :employee_id,
        :event_id,
        employee_attributes: [
          :active,
          :labor,
          :rate_hand_per_job,
          :rate_full_job,
          :rate_on_premise_one_man,
          :rate_on_premise,
          :rate_hourly,
          :rate_hourly_office_shop,
          :rate_demo, :email,
          :contact_id,
          contact_attributes: [
            :photo,
            :prefix,
            :first_name,
            :last_name,
            :phone_number,
            :email,
            :ss,
            email_addresses_attributes: [
              :email_address,
              :notifications
            ]
          ]
        ],
      )
    end
end
