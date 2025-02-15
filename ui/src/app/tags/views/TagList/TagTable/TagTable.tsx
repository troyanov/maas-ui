import type { ReactNode } from "react";
import { useEffect } from "react";

import type {
  MainTableProps,
  PropsWithSpread,
} from "@canonical/react-components";
import { Icon, MainTable, Strip, Tooltip } from "@canonical/react-components";
import type { History } from "history";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { TAGS_PER_PAGE } from "../constants";

import TableActions from "app/base/components/TableActions";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import { actions as tagActions } from "app/store/tag";
import { TagSearchFilter } from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import { TagMeta } from "app/store/tag/types";
import AppliedTo from "app/tags/components/AppliedTo";
import tagURLs from "app/tags/urls";
import { breakLines, isComparable, unindentString } from "app/utils";

type Props = PropsWithSpread<
  {
    currentPage: number;
    filter: TagSearchFilter;
    onDelete: (id: Tag[TagMeta.PK], fromDetails?: boolean) => void;
    searchText: string;
    setCurrentPage: (page: number) => void;
    tags: Tag[];
  },
  MainTableProps
>;

export enum Label {
  Actions = "Actions",
  AppliedTo = "Applied to",
  Auto = "Auto",
  Name = "Tag name",
  Options = "Kernel options",
  Updated = "Last update",
}

export enum TestId {
  NoTags = "no-tags",
}

type SortKey = keyof Tag;

const getSortValue = (sortKey: SortKey, tag: Tag) => {
  const value = tag[sortKey];
  return isComparable(value) ? value : null;
};

const generateRows = (
  tags: Tag[],
  onDelete: Props["onDelete"],
  history: History
) =>
  tags.map((tag) => {
    return {
      key: `tag-row-${tag.id}`,
      columns: [
        {
          "aria-label": Label.Name,
          content: (
            <Link to={tagURLs.tag.index({ id: tag.id })}>{tag.name}</Link>
          ),
        },
        {
          "aria-label": Label.Updated,
          content: tag.updated,
        },
        {
          "aria-label": Label.Auto,
          content: !!tag.definition ? <Icon name="success-grey" /> : null,
        },
        {
          "aria-label": Label.AppliedTo,
          content: <AppliedTo id={tag.id} />,
        },
        {
          "aria-label": Label.Options,
          content: !!tag.kernel_opts ? <Icon name="success-grey" /> : null,
        },
        {
          "aria-label": Label.Actions,
          content: (
            <TableActions
              onDelete={() => {
                onDelete(tag[TagMeta.PK]);
              }}
              onEdit={() =>
                history.push({
                  pathname: tagURLs.tag.update({ id: tag.id }),
                  state: { canGoBack: true },
                })
              }
            />
          ),
          className: "u-align--right",
        },
      ],
      sortData: {
        name: tag.name,
        updated: tag.updated,
      },
    };
  });

const generateNoTagsMessage = (
  noTags: boolean,
  filter: TagSearchFilter,
  searchText: string
) => {
  const hasFilter = filter !== TagSearchFilter.All;
  let noTagsMessage: ReactNode = null;
  if (noTags && (searchText || hasFilter)) {
    let filterName: string | null = null;
    if (hasFilter) {
      filterName = filter === TagSearchFilter.Auto ? "automatic" : "manual";
    }
    let message: string | null = null;
    if (hasFilter && !searchText) {
      message = `There are no ${filterName} tags.`;
    } else if (searchText) {
      message = `No${
        filterName ? ` ${filterName}` : ""
      } tags match the search criteria.`;
    }
    if (message) {
      noTagsMessage = (
        <Strip
          shallow
          rowClassName="u-align--center"
          data-testid={TestId.NoTags}
        >
          {message}
        </Strip>
      );
    }
  }
  return noTagsMessage;
};

const TagTable = ({
  currentPage,
  filter,
  onDelete,
  searchText,
  setCurrentPage,
  tags,
  ...tableProps
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentSort, sortRows, updateSort } = useTableSort<Tag, SortKey>(
    getSortValue,
    {
      key: "name",
      direction: SortDirection.DESCENDING,
    }
  );
  const sortedTags = sortRows(tags);
  const paginatedTags = sortedTags.slice(
    (currentPage - 1) * TAGS_PER_PAGE,
    currentPage * TAGS_PER_PAGE
  );

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    // Go to the first page if the search text or filters are updated.
    setCurrentPage(1);
  }, [filter, searchText, setCurrentPage]);

  return (
    <>
      <MainTable
        {...tableProps}
        className="p-table-expanding--light"
        headers={[
          {
            content: (
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("name")}
                sortKey="name"
              >
                {Label.Name}
              </TableHeader>
            ),
          },
          {
            content: (
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("updated")}
                sortKey="updated"
              >
                {Label.Updated}
              </TableHeader>
            ),
          },
          {
            content: (
              <>
                {Label.Auto}{" "}
                <Tooltip
                  // TODO: add a link to the docs:
                  // https://github.com/canonical-web-and-design/app-tribe/issues/739
                  message={
                    <>
                      {breakLines(
                        unindentString(
                          `Automatic tags are automatically applied to every 
                        machine that matches their definition.`
                        )
                      )}
                      <br />
                      <a href="#todo">
                        Check the documentation about automatic tags.
                      </a>
                    </>
                  }
                  position="top-center"
                >
                  <Icon name="information" />
                </Tooltip>
              </>
            ),
          },
          {
            content: Label.AppliedTo,
          },
          {
            content: Label.Options,
          },
          {
            content: Label.Actions,
            className: "u-align--right",
          },
        ]}
        rows={generateRows(paginatedTags, onDelete, history)}
      />
      {generateNoTagsMessage(tags.length === 0, filter, searchText)}
    </>
  );
};

export default TagTable;
