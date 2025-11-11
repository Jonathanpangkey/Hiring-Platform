"use client";

import {useState, useRef, useMemo, useEffect} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Candidate} from "@/app/types/jobType";
import {formatDate} from "@/app/lib/utils/utils";
import {ChevronUp, ChevronDown, ChevronsUpDown, GripVertical, X, Filter as FilterIcon} from "lucide-react";

interface CandidateTableProps {
  candidates: Candidate[];
}

interface ColumnConfig {
  key: string;
  label: string;
  width: number;
  visible: boolean;
}

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

type FilterConfig = {
  [key: string]: string;
};

export default function CandidateTable({candidates}: CandidateTableProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [columns, setColumns] = useState<ColumnConfig[]>([
    {key: "full_name", label: "Nama Lengkap", width: 180, visible: true},
    {key: "email", label: "Email Address", width: 200, visible: true},
    {key: "phone_number", label: "Phone Numbers", width: 150, visible: true},
    {key: "date_of_birth", label: "Date of Birth", width: 140, visible: true},
    {key: "domicile", label: "Domicile", width: 150, visible: true},
    {key: "gender", label: "Gender", width: 100, visible: true},
    {key: "linkedin_link", label: "Link LinkedIn", width: 200, visible: true},
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [openFilterPopover, setOpenFilterPopover] = useState<string | null>(null);

  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

  const getAttributeValue = (candidate: Candidate, key: string) => {
    const attr = candidate.attributes.find((a) => a.key === key);
    return attr?.value || "-";
  };

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") {
          return {key, direction: "desc"};
        }
        return null;
      }
      return {key, direction: "asc"};
    });
  };

  const handleFilter = (key: string, value: string) => {
    setFilters((prev) => {
      if (value === "") {
        const newFilters = {...prev};
        delete newFilters[key];
        return newFilters;
      }
      return {...prev, [key]: value};
    });
    setCurrentPage(1);
  };

  const clearFilter = (key: string) => {
    setFilters((prev) => {
      const newFilters = {...prev};
      delete newFilters[key];
      return newFilters;
    });
    setCurrentPage(1);
  };

  const filteredAndSortedCandidates = useMemo(() => {
    let result = [...candidates];

    Object.entries(filters).forEach(([key, value]) => {
      result = result.filter((candidate) => {
        const attrValue = getAttributeValue(candidate, key).toLowerCase();
        return attrValue.includes(value.toLowerCase());
      });
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = getAttributeValue(a, sortConfig.key);
        const bValue = getAttributeValue(b, sortConfig.key);

        if (aValue === "-") return 1;
        if (bValue === "-") return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [candidates, filters, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedCandidates.length / itemsPerPage);
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAndSortedCandidates.slice(start, end);
  }, [filteredAndSortedCandidates, currentPage, itemsPerPage]);

  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    const column = columns.find((c) => c.key === columnKey);
    if (column) {
      setResizingColumn(columnKey);
      resizeStartX.current = e.clientX;
      resizeStartWidth.current = column.width;
    }
  };

  useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (!resizingColumn) return;

      const diff = e.clientX - resizeStartX.current;
      const newWidth = Math.max(80, resizeStartWidth.current + diff);

      setColumns((prev) => prev.map((col) => (col.key === resizingColumn ? {...col, width: newWidth} : col)));
    };

    const handleResizeEnd = () => {
      setResizingColumn(null);
    };

    if (resizingColumn) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [resizingColumn]);

  const handleDragStart = (e: React.DragEvent, columnKey: string) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    if (draggedColumn !== columnKey) {
      setDragOverColumn(columnKey);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnKey) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    setColumns((prev) => {
      const newColumns = [...prev];
      const draggedIndex = newColumns.findIndex((c) => c.key === draggedColumn);
      const targetIndex = newColumns.findIndex((c) => c.key === targetColumnKey);

      const [removed] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(targetIndex, 0, removed);

      return newColumns;
    });

    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(paginatedCandidates.map((c) => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates([...selectedCandidates, id]);
    } else {
      setSelectedCandidates(selectedCandidates.filter((cId) => cId !== id));
    }
  };

  const isAllSelected = paginatedCandidates.length > 0 && paginatedCandidates.every((c) => selectedCandidates.includes(c.id));

  const renderSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) {
      return <ChevronsUpDown className='h-3.5 w-3.5 text-neutral-400' />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className='h-3.5 w-3.5 text-primary-main' />
    ) : (
      <ChevronDown className='h-3.5 w-3.5 text-primary-main' />
    );
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className='space-y-4'>
      {/* Toolbar */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {activeFilterCount > 0 && (
            <div className='flex items-center gap-2'>
              <span className='text-sm text-neutral-600'>{activeFilterCount} filter(s) active</span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setFilters({});
                  setCurrentPage(1);
                }}>
                <X className='h-4 w-4 mr-1' />
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className='bg-white rounded-lg border border-neutral-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-neutral-50 border-b border-neutral-200'>
              <tr>
                <th className='w-12 px-4 py-3 sticky left-0 bg-neutral-50 z-10'>
                  <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                </th>
                {columns
                  .filter((col) => col.visible)
                  .map((column) => (
                    <th
                      key={column.key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, column.key)}
                      onDragOver={(e) => handleDragOver(e, column.key)}
                      onDrop={(e) => handleDrop(e, column.key)}
                      style={{width: column.width, minWidth: column.width, maxWidth: column.width}}
                      className={`px-4 py-3 text-left text-xs font-semibold text-neutral-900 uppercase tracking-wider relative group ${
                        dragOverColumn === column.key ? "bg-primary-100" : ""
                      }`}>
                      <div className='flex items-center gap-1.5'>
                        <GripVertical className='h-4 w-4 text-neutral-400 cursor-move shrink-0 opacity-0 group-hover:opacity-100 transition-opacity' />
                        <button
                          onClick={() => handleSort(column.key)}
                          className='flex items-center gap-1.5 hover:text-primary-main transition-colors flex-1 min-w-0'>
                          <span className='truncate'>{column.label}</span>
                          {renderSortIcon(column.key)}
                        </button>

                        {/* Filter Popover */}
                        <Popover open={openFilterPopover === column.key} onOpenChange={(open) => setOpenFilterPopover(open ? column.key : null)}>
                          <PopoverTrigger asChild>
                            <button
                              className={`p-1 rounded hover:bg-neutral-200 transition-colors shrink-0 ${
                                filters[column.key] ? "text-primary-main" : "text-neutral-400"
                              }`}
                              onClick={(e) => e.stopPropagation()}>
                              <FilterIcon className='h-3.5 w-3.5' />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className='w-64 p-3 bg-white' align='start'>
                            <div className='space-y-3'>
                              <div className='flex items-center justify-between'>
                                <h4 className='font-medium text-sm'>Filter {column.label}</h4>
                                {filters[column.key] && (
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => {
                                      clearFilter(column.key);
                                      setOpenFilterPopover(null);
                                    }}
                                    className='h-6 px-2 text-xs'>
                                    Clear
                                  </Button>
                                )}
                              </div>
                              <Input
                                placeholder='Search...'
                                value={filters[column.key] || ""}
                                onChange={(e) => handleFilter(column.key, e.target.value)}
                                className='h-8'
                                autoFocus
                              />
                              <div className='text-xs text-neutral-500'>Press Enter to apply filter</div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div
                        onMouseDown={(e) => handleResizeStart(e, column.key)}
                        className='absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary-main active:bg-primary-dark transition-colors z-20'
                        style={{
                          opacity: resizingColumn === column.key ? 1 : 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                          if (resizingColumn !== column.key) {
                            e.currentTarget.style.opacity = "0";
                          }
                        }}
                      />
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-neutral-200'>
              {paginatedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={columns.filter((c) => c.visible).length + 1} className='px-4 py-12 text-center text-neutral-500'>
                    {Object.keys(filters).length > 0 ? "No candidates match the filters" : "No candidates yet"}
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((candidate) => (
                  <tr key={candidate.id} className='hover:bg-neutral-50 transition-colors'>
                    <td className='px-4 py-4 sticky left-0 bg-white hover:bg-neutral-50'>
                      <Checkbox
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={(checked) => handleSelectCandidate(candidate.id, checked as boolean)}
                      />
                    </td>
                    {columns
                      .filter((col) => col.visible)
                      .map((column) => {
                        const value = getAttributeValue(candidate, column.key);
                        const isDate = column.key === "date_of_birth" && value !== "-";
                        const isLink = column.key === "linkedin_link" && value !== "-";

                        return (
                          <td
                            key={column.key}
                            style={{width: column.width, minWidth: column.width, maxWidth: column.width}}
                            className={`px-4 py-4 text-sm ${column.key === "full_name" ? "text-neutral-900 font-medium" : "text-neutral-600"}`}>
                            {isDate ? (
                              formatDate(value)
                            ) : isLink ? (
                              <a
                                href={value}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-primary-main hover:text-primary-dark hover:underline truncate block'
                                style={{maxWidth: column.width - 32}}>
                                {value}
                              </a>
                            ) : (
                              <span className='truncate block' style={{maxWidth: column.width - 32}}>
                                {value}
                              </span>
                            )}
                          </td>
                        );
                      })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredAndSortedCandidates.length > 0 && (
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-neutral-600'>Rows per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}>
              <SelectTrigger className='w-20 h-8'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='25'>25</SelectItem>
                <SelectItem value='50'>50</SelectItem>
                <SelectItem value='100'>100</SelectItem>
              </SelectContent>
            </Select>
            <span className='text-sm text-neutral-600'>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedCandidates.length)} of{" "}
              {filteredAndSortedCandidates.length}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className='text-sm text-neutral-600'>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
