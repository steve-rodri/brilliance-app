import React from "react";
import List from "../List/";
import AddNew from "../Buttons/AddNew";
import QueryPanel from "../QueryPanel";
import { useSelector } from "react-redux";
import { singularTense } from "../../helpers";
import "./index.css";

//collectionType
//collection
//listMethods

const CollectionPage = props => {
  return (
    <div className="CollectionPage">
      <SidePanel {...props} />
      <Main {...props} />
    </div>
  );
};

const SidePanel = props => {
  const mobile = useSelector(state => state.view.mobile);
  if (mobile) return null;
  return (
    <aside>
      <QueryPanel {...props} />
    </aside>
  );
};

const Main = ({ collection, ...rest }) => {
  const styleMain = () => {
    if (collection.list.data.length) return {};
    else
      return {
        gridTemplateRows: "40px 1fr auto"
      };
  };
  return (
    <main style={styleMain()}>
      <Title title={collection.search.title} />
      <CollectionList list={collection.list} {...rest} />
      <EndMessage list={collection.list} {...rest} />
    </main>
  );
};

const Title = ({ title }) => {
  return (
    <div className="CollectionPage--category-title-container">
      <h3 className="CollectionPage--category-title">{title}</h3>
    </div>
  );
};

const CollectionList = ({ list, listMethods, ...rest }) => {
  const mobile = useSelector(state => state.view.mobile);
  const styleList = () => {
    if (list.data.length) return {};
    else if (mobile) {
      return {
        justifyContent: "center",
        height: "calc(100vh - 225px - var(--mobile-adj))"
      };
    } else {
      return { justifyContent: "center", height: "calc(100vh - 155px)" };
    }
  };
  return (
    <div className="CollectionPage--list" style={styleList()}>
      <List {...list} {...listMethods} {...rest} />
    </div>
  );
};

const EndMessage = ({ list, collectionType }) => {
  const singular = singularTense(collectionType);
  const {
    view: { mobile },
    user: { accessLevel }
  } = useSelector(state => state);
  return (
    <div className="CollectionPage--end-message">
      {list.data.length ? (
        list.totalCount ? (
          <h4>{`${list.totalCount} ${
            list.totalCount === 1 ? singular : collectionType
          }`}</h4>
        ) : (
          <h4>{`${list.data.length} ${
            list.data.length === 1 ? singular : collectionType
          }`}</h4>
        )
      ) : mobile && !list.loading ? (
        <div>
          <AddNew
            style={{ alignSelf: "end" }}
            linkPath={`/${accessLevel}/${collectionType.toLowerCase()}/new`}
            type={singular}
          />
        </div>
      ) : null}
    </div>
  );
};

export default CollectionPage;
