
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Shield, Activity, Mail, Search, Filter, Download } from 'lucide-react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { format } from 'date-fns';

const SecurityAuditDashboard: React.FC = () => {
  const {
    auditLogs,
    activityLogs,
    securityStats,
    filters,
    setFilters,
    isLoading,
    canViewAuditLogs
  } = useSecurityAudit();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('create') || action.includes('signup')) return 'bg-green-500';
    if (action.includes('delete') || action.includes('remove')) return 'bg-red-500';
    if (action.includes('update') || action.includes('edit')) return 'bg-blue-500';
    if (action.includes('login') || action.includes('auth')) return 'bg-accent-teal';
    return 'bg-gray-500';
  };

  if (!canViewAuditLogs) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
        <p className="text-muted-foreground">Admin privileges required to view security audit logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security Audit Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor system security events and user activities
          </p>
        </div>
      </div>

      {/* Security Stats */}
      {securityStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityStats.totalAuditLogs}</div>
              <p className="text-xs text-muted-foreground">Total logged actions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Activities</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityStats.totalActivityLogs}</div>
              <p className="text-xs text-muted-foreground">User interactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Verifications</CardTitle>
              <Mail className="h-4 w-4 text-accent-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityStats.totalVerificationLogs}</div>
              <p className="text-xs text-muted-foreground">Email attempts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Action Filter</label>
              <Input
                placeholder="Filter by action..."
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) => handleFilterChange('dateRange', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">User ID</label>
              <Input
                placeholder="Filter by user ID..."
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Tabs */}
      <Tabs defaultValue="admin" className="space-y-4">
        <TabsList>
          <TabsTrigger value="admin">Admin Audit Log</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-muted h-16 rounded"></div>
                  ))}
                </div>
              ) : auditLogs && auditLogs.length > 0 ? (
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getActionBadgeColor(log.action)}>
                              {log.action}
                            </Badge>
                            {log.table_name && (
                              <Badge variant="outline">{log.table_name}</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>User: {log.user_id?.substring(0, 8)}...</p>
                            {log.record_id && <p>Record: {log.record_id}</p>}
                            <p>Time: {format(new Date(log.created_at), 'PPpp')}</p>
                          </div>
                        </div>
                        {(log.old_values || log.new_values) && (
                          <Button variant="ghost" size="sm">
                            <Search className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No admin actions found for the selected filters.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-muted h-16 rounded"></div>
                  ))}
                </div>
              ) : activityLogs && activityLogs.length > 0 ? (
                <div className="space-y-3">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getActionBadgeColor(log.action)}>
                              {log.action}
                            </Badge>
                            {log.resource_type && (
                              <Badge variant="outline">{log.resource_type}</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>User: {log.user_id?.substring(0, 8)}...</p>
                            {log.resource_id && <p>Resource: {log.resource_id.substring(0, 8)}...</p>}
                            <p>Time: {format(new Date(log.created_at), 'PPpp')}</p>
                          </div>
                        </div>
                        {log.details && (
                          <Button variant="ghost" size="sm">
                            <Search className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No user activities found for the selected filters.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityAuditDashboard;
