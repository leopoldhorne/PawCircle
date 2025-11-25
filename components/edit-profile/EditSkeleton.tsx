import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";

const EditSkeleton = () => {
  return (
    <Table className="max-w-full h-full">
      <TableBody>
        {/* Profile photo row */}
        <TableRow>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          <TableCell className="h-20 flex justify-center">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
            </div>
          </TableCell>
        </TableRow>

        {/* 3 placeholder circle rows */}
        {[...Array(3)].map((_, i) => (
          <TableRow key={i}>
            <TableCell className="whitespace-nowrap">
              <Skeleton className="h-4 w-32" />
            </TableCell>

            <TableCell>
              <div className="mx-auto w-40 h-40 rounded-xl border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EditSkeleton;
