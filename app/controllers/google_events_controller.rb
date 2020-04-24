class GoogleEventsController < ApplicationController
@@sync_params = {}

  def update
    @events = []
    if params[:events]
      params[:events].each do | google_event |
        set_google_event_params(google_event)
        if @google_event && @google_event.update(@@sync_params)
          @events.push(@google_event)
        end
      end
      render json: @events, include: "**"
    end
  end

  private

  def set_google_event_params(google_event)
    #find or create event
    if google_event[:organizer][:email] == params[:admin_calendar_id]
      @google_event = Event.find_or_create_by gc_i_cal_uid: google_event[:i_cal_u_i_d]
    end

    #identifiers
    @@sync_params[:gc_id] = google_event[:id]
    @@sync_params[:gc_i_cal_uid] = google_event[:i_cal_u_i_d]

    #summary
    @@sync_params[:summary] = google_event[:summary]

    #html_link
    @@sync_params[:html_link] = google_event[:html_link]

    #start
    if google_event[:start][:date]
      @@sync_params[:start] = Time.zone.parse(google_event[:start][:date])
    elsif google_event[:start][:date_time]
      @@sync_params[:start] = Time.zone.parse(google_event[:start][:date_time])
    end

    #end
    if google_event[:end][:date]
      @@sync_params[:end] = Time.zone.parse(google_event[:end][:date])
    elsif google_event[:end][:date_time]
      @@sync_params[:end] = Time.zone.parse(google_event[:end][:date_time])
    end

    #status
    if google_event[:status]
      case google_event[:status]
      when "tentative"
        @@sync_params[:confirmation] = "Unconfirmed"
      when "confirmed"
        @@sync_params[:confirmation] = "Confirmed"
      when "cancelled"
        @@sync_params[:confirmation] = "Cancelled"
      end
    end

    #attendees
    if google_event[:attendees]
      google_event[:attendees].each do | attendee |
        # email, display_name, response_status
        @google_event
          .event_employees
          .create_or_update_by_email(
            attendee.slice(
              :email,
              :display_name,
              :response_status
            )
          )
      end
    end


    #creator
    if google_event[:creator]
      email_address = EmailAddress.find_or_create_by(
        email_address: google_event[:creator][:email]
      )
      if email_address.contact
        contact = email_address.contact
      elsif google_event[:creator][:display_name]
        contact = email_address.create_contact(
          first_name: google_event[:creator][:display_name].split(' ')[0],
          last_name: google_event[:creator][:display_name].split(' ')[1]
        )
      else
        contact = email_address.create_contact()
      end
      @@sync_params[:creator_id] = contact[:id]
    end

    #description
    if google_event[:description]
      spacer = "***************************************";
      subsection = google_event[:description].include? spacer;
      if subsection
        length = "#{spacer}\n\n".length;
        i = google_event[:description].index(spacer);
        notes = google_event[:description].slice(i + length);
        @@sync_params[:notes] = notes;
      else
        @@sync_params[:notes] = google_event[:description];
      end
    end
  end

# params.permit(
#   :name,
#   { emails: [] },
#   friends: [
#     :name,
#     { family: [ :name ],
#       hobbies: []
#     }
#   ]
# )
# {
#   "id": string,
#   "status": string,
#   "htmlLink": string,
#   "created": datetime,
#   "updated": datetime,
#   "summary": string,
#   "description": string,
#   "location": string,
#   "creator": {
#     "id": string,
#     "email": string,
#     "displayName": string,
#     "self": boolean
#   },
#   "organizer": {
#     "id": string,
#     "email": string,
#     "displayName": string,
#     "self": boolean
#   },
#   "start": {
#     "date": date,
#     "dateTime": datetime,
#     "timeZone": string
#   },
#   "end": {
#     "date": date,
#     "dateTime": datetime,
#     "timeZone": string
#   },
#   "endTimeUnspecified": boolean,
#   "recurrence": [
#     string
#   ],
#   "recurringEventId": string,
#   "originalStartTime": {
#     "date": date,
#     "dateTime": datetime,
#     "timeZone": string
#   },
#   "transparency": string,
#   "visibility": string,
#   "iCalUID": string,
#   "sequence": integer,
#   "attendees": [
#     {
#       "id": string,
#       "email": string,
#       "displayName": string,
#       "organizer": boolean,
#       "self": boolean,
#       "resource": boolean,
#       "optional": boolean,
#       "responseStatus": string,
#       "comment": string,
#       "additionalGuests": integer
#     }
#   ],
#   "attendeesOmitted": boolean,
#   "hangoutLink": string,
#   "conferenceData": {
#     "createRequest": {
#       "requestId": string,
#       "conferenceSolutionKey": {
#         "type": string
#       },
#       "status": {
#         "statusCode": string
#       }
#     },
#     "entryPoints": [
#       {
#         "entryPointType": string,
#         "uri": string,
#         "label": string,
#         "pin": string,
#         "accessCode": string,
#         "meetingCode": string,
#         "passcode": string,
#         "password": string
#       }
#     ],
#     "conferenceSolution": {
#       "key": {
#         "type": string
#       },
#       "name": string,
#       "iconUri": string
#     },
#     "conferenceId": string,
#     "signature": string,
#     "notes": string,
#     "gadget": {
#     "type": string,
#     "title": string,
#     "link": string,
#     "iconLink": string,
#     "width": integer,
#     "height": integer,
#     "display": string,
#   },
#   "anyoneCanAddSelf": boolean,
#   "guestsCanInviteOthers": boolean,
#   "guestsCanModify": boolean,
#   "guestsCanSeeOtherGuests": boolean,
#   "privateCopy": boolean,
#   "locked": boolean,
#   "reminders": {
#     "useDefault": boolean,
#     "overrides": [
#       {
#         "method": string,
#         "minutes": integer
#       }
#     ]
#   },
#   "source": {
#     "url": string,
#     "title": string
#   },
#   "attachments": [
#     {
#       "fileUrl": string,
#       "title": string,
#       "mimeType": string,
#       "iconLink": string,
#       "fileId": string
#     }
#   ]
# }
end
