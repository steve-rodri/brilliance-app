import React, { useEffect, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setSection,
  setDate,
  setTodaysDate,
  newEventsQueryStarted,
  setEventListScrollPosition,
  setEventSearchParams,
  clearEventSearchParams,
  fetchEvents,
} from "../../redux";
import { formatParamsFromQueryString, columnHeaders } from "../../helpers";
import CollectionPage from "../../components/CollectionPage";
import EventDetail from "./EventDetail/";

const Events = ({ match }) => {
  const dispatch = useDispatch();
  const section = useSelector((state) => state.view.section);
  const events = useSelector((state) => state.section.events);
  const rootMatch = useRouteMatch(match.path);
  const createMatch = useRouteMatch(`${match.path}/new`);
  const showMatch = useRouteMatch(`${match.path}/:id`);
  useEffect(() => {
    if (section !== "Events") dispatch(setSection("Events"));
  }, [dispatch, section]);

  useEffect(() => {
    if (rootMatch.isExact) {
      dispatch(newEventsQueryStarted(events.search.params));
    }
  }, [dispatch, rootMatch.isExact, events.search.params]);
  if (rootMatch.isExact) return <EventsCollection match={rootMatch} />;
  if (createMatch) return <EventDetail match={createMatch} />;
  if (showMatch) return <EventDetail match={showMatch} />;
};

const EventsCollection = ({ match }) => {
  const events = useSelector((state) => state.section.events);
  const { replace, location } = useHistory();
  const dispatch = useDispatch();
  const refresh = () => replace(match.path);

  useEffect(() => {
    const params = formatParamsFromQueryString(location.search);
    if (JSON.stringify(params) !== JSON.stringify(events.search.params)) {
      if (!params) {
        dispatch(clearEventSearchParams());
        dispatch(setTodaysDate());
      } else {
        dispatch(setEventSearchParams(params));
        const dateConditionsMet =
          params &&
          params.start &&
          params.end &&
          events.search.params &&
          events.search.params.start &&
          events.search.params.end &&
          (params.start !== events.search.params.start ||
            params.end !== events.search.params.end);
        if (dateConditionsMet) dispatch(setDate({ ...params }));
      }
    }
  }, [dispatch, location.search, events.search.params]);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch, events.search.params]);
  const listMethods = {
    loadMore: () => dispatch(fetchEvents()),
    setScrollPosition: useCallback(
      (position) => dispatch(setEventListScrollPosition(position)),
      [dispatch]
    ),
    columnHeaders: () => columnHeaders("Events"),
    columnHeaderStyles: () => ({
      grid: "auto / 1fr 150px 150px",
      gridAutoFlow: "column",
      gridAutoColumns: "auto",
    }),
  };

  return (
    <CollectionPage
      collectionType="Events"
      collection={events}
      listMethods={listMethods}
      refresh={refresh}
    />
  );
};

export default Events;
