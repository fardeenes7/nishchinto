import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";

export function LTVTable({ customers }: { customers: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead className="text-right">Orders</TableHead>
          <TableHead className="text-right">LTV</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.customer_phone}>
            <TableCell>
              <div className="font-medium">{customer.customer_name || "Guest"}</div>
              <div className="text-xs text-muted-foreground">{customer.customer_phone}</div>
            </TableCell>
            <TableCell className="text-right">{customer.total_orders}</TableCell>
            <TableCell className="text-right font-mono">৳{parseFloat(customer.lifetime_value).toLocaleString()}</TableCell>
          </TableRow>
        ))}
        {customers.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
              No data yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
