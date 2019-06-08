class PlacesController < ApplicationController
  before_action :set_place, only: [:show, :update, :destroy]

  # GET /places
  def index
    @places = Place.all

    render json: @places, include: '**'
  end

  # GET /places/1
  def show
    render json: @place, include: '**'
  end

  # POST /places
  def create
    @place = Place.new(place_params)

    if @place.save
      render json: @place, status: :created, location: @place, include: '**'
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /places/1
  def update
    if @place.update(place_params)
      render json: @place, include: '**'
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

  # DELETE /places/1
  def destroy
    @place.destroy
  end

  # GET /places/find
  def find
    terms = params[:q].split
    query = ''
    terms.each do |term|
      query += "(name LIKE '%#{term}%'
        OR name LIKE '%#{term.capitalize}%'
        OR name LIKE '%#{term.upcase}%'
        OR name LIKE '%#{term.downcase}%'
        OR short_name LIKE '%#{term}%'
        OR short_name LIKE '%#{term.capitalize}%'
        OR short_name LIKE '%#{term.upcase}%'
        OR short_name LIKE '%#{term.downcase}%')"

      if terms.index(term) + 1 < terms.length
        query += " AND "
      end
    end

    @places = Place
      .distinct
      .where(query)
      .order(:name)
    render json: @places, include: '**'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place
      @place = Place.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def place_params
      params.require(:place).permit(:installation, :photo, :name, :short_name, :commission)
    end
end
