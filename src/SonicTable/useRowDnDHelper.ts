import React from "react";

const useRowDnDHelper = ({
  data,
  setData,
  dragState,
  isDragging,
  isDropping,
  setIsDropping,
  setIsDraggable,
  setIsDragging,
  setDragState,
  setIsHover,
  onRowDrop,
  onRowShuffle,
}: {
  data: Array<Object>;
  setData: Function;
  dragState: { dragRow: any; hoverRow: any };
  isDragging: boolean;
  isDropping: boolean;
  setIsDropping: Function;
  setIsDraggable: Function;
  setIsDragging: Function;
  setDragState: Function;
  setIsHover: Function;
  onRowDrop: Function;
  onRowShuffle: Function;
}) => {
  const enableDragAndDrop = () => {
    if (isDragging) return;
    setIsDropping(true);
    setIsDraggable(true);
  };

  const enableDragging = () => {
    if (isDragging) return;
    setIsDraggable(true);
  };
  const disableDragging = () => {
    setDragState((prev: Object) => ({ ...prev, dragRow: null }));
    setIsDragging(false);
  };

  const disableDropping = () => {
    setIsDropping(false);
    setIsDraggable(false);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    row: any
  ) => {
    (e.target as HTMLTableRowElement).style.backgroundColor = "#fff";
    setDragState((prev: Object) => ({ ...prev, dragRow: row }));
    setTimeout(() => {
      setIsDragging(true);
    }, 0);
  };

  /**
   * ****** updateData() function
   * @param dragrow
   * @param hoverRow
   * @param indexes
   * @returns
   *
   *  this function updates the table data to mimic shuffling
   */
  const updateData = (dragrow: any, hoverRow: any, indexes: Array<number>) => {
    const newData = JSON.parse(JSON.stringify(data));

    if (indexes.length === 1) {
      const dragRecord = newData[dragrow.index];
      newData.splice(dragrow.index, 1);
      newData.splice(hoverRow.index, 0, dragRecord);
      setData(() => newData);
      return;
    }

    const changeNestedData = (length: number, data: any, level: number) => {
      if (level === length - 2) {
        const dragRecord = data.subRows[dragrow.index];
        data.subRows.splice(dragrow.index, 1);
        data.subRows.splice(hoverRow.index, 0, dragRecord);
        return data.subRows;
      }
      const record = data.subRows[indexes[level + 1]];
      record.subRows = changeNestedData(length, record, level + 1);
      data.subRows[indexes[level]] = record;
      return data.subRows;
    };

    newData[indexes[0]].subRows = changeNestedData(
      indexes.length,
      newData[indexes[0]],
      0
    );

    setData(() => newData);
  };

  const handleRowMove = (e: React.DragEvent<HTMLTableRowElement>, row: any) => {
    const hoverRow = row;
    const isSame = dragState.dragRow.id === hoverRow.id;
    if (isSame) return;
    if (isDropping) {
      setIsHover(true);
      return;
    }

    const dragIndexes = dragState.dragRow.id
      .split(".")
      .map((item: string) => parseInt(item, 10));
    const hoverIndexs = hoverRow.id
      .split(".")
      .map((item: string) => parseInt(item, 10));

    const getIsSibling = () => {
      if (dragIndexes.length !== hoverIndexs.length) return false;

      for (let i = 0; i < dragIndexes.length - 1; i++) {
        if (dragIndexes[i] !== hoverIndexs[i]) {
          return false;
        }
      }
      return true;
    };

    if (!getIsSibling()) {
      return;
    }

    /**
     * call the function to shuffle the data
     *
     */
    updateData(dragState.dragRow, hoverRow, dragIndexes);
    setDragState(
      ({
        dragRow,
        hoverRow: hoverrow,
      }: {
        dragRow: Object;
        hoverRow: Object;
      }) => ({
        hoverRow: hoverRow,
        dragRow: { ...dragRow, index: hoverRow.index, id: hoverRow.id },
      })
    );
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, row: any) => {
    const isRowSame = dragState.dragRow.id === row.id;
    if (!isDropping) {
      onRowShuffle(dragState.dragRow, dragState.hoverRow);
    }
    setIsHover(false);
    setIsDropping(false);
    const dropRow = row;
    if (isRowSame) return;
    console.log("drop");
    onRowDrop(dragState.dragRow, dropRow);
  };

  const handleDragLeave = () => {
    if (isDropping) {
      setIsHover(false);
    }
  };

  return {
    enableDragAndDrop,
    enableDragging,
    handleDragStart,
    handleDragLeave,
    handleRowMove,
    handleDrop,
    disableDragging,
    disableDropping,
  };
};

export default useRowDnDHelper;
