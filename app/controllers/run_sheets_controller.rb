class RunSheetsController < ApplicationController
  before_action :set_run_sheet, only: [:show, :update, :destroy]

  # GET /run_sheets
  def index
    @run_sheets = RunSheet.all

    render json: @run_sheets
  end

  # GET /run_sheets/1
  def show
    render json: @run_sheet
  end

  # POST /run_sheets
  def create
    @run_sheet = RunSheet.new(run_sheet_params)

    if @run_sheet.save
      render json: @run_sheet, status: :created, location: @run_sheet
    else
      render json: @run_sheet.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /run_sheets/1
  def update
    if @run_sheet.update(run_sheet_params)
      render json: @run_sheet
    else
      render json: @run_sheet.errors, status: :unprocessable_entity
    end
  end

  # DELETE /run_sheets/1
  def destroy
    @run_sheet.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_run_sheet
      @run_sheet = RunSheet.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def run_sheet_params
      params.require(:run_sheet).permit(:guest_of_honor, :dj, :walls_foundation, :dome_foundation, :coffer_foundation, :columns_foundation, :elevator, :bar, :tier, :walls_entrance, :intells_entrance, :dome_entrance, :candle_lighting, :logo, :montage, :screens, :bar_screens_adult_cocktail, :kids_zeus_room, :zapshots, :foundation, :intro_bridal_party, :bride_and_groom, :first_dance, :toast, :dinner, :cake_cutting, :bride_and_father, :groom_and_mother, :comments, :event_id)
    end
end
