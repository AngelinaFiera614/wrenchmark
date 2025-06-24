
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plug, 
  Globe, 
  Smartphone, 
  Zap, 
  Shield,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Settings,
  Database,
  Cloud
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: 'api' | 'catalog' | 'supplier' | 'mobile';
  status: 'active' | 'inactive' | 'error';
  description: string;
  endpoint?: string;
  lastSync?: string;
  syncFrequency?: string;
  features: string[];
}

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  authenticated: boolean;
  rateLimited: boolean;
}

const IntegrationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState("integrations");

  // Mock data for demonstration
  const [integrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Parts Supplier API',
      type: 'supplier',
      status: 'active',
      description: 'Real-time component pricing and availability from major suppliers',
      endpoint: 'https://api.partsupplier.com/v1',
      lastSync: '2024-01-15 14:30:00',
      syncFrequency: 'Every 4 hours',
      features: ['Real-time pricing', 'Stock levels', 'Lead times', 'Bulk ordering']
    },
    {
      id: '2',
      name: 'Mobile App Integration',
      type: 'mobile',
      status: 'active',
      description: 'Native mobile app for field technicians and mechanics',
      features: ['Offline sync', 'Barcode scanning', 'Component lookup', 'Assignment tools']
    },
    {
      id: '3',
      name: 'External Catalog Bridge',
      type: 'catalog',
      status: 'inactive',
      description: 'Connect with third-party motorcycle parts catalogs',
      endpoint: 'https://api.partscatalog.com/v2',
      features: ['Catalog import', 'Cross-referencing', 'Compatibility matching']
    },
    {
      id: '4',
      name: 'Public API',
      type: 'api',
      status: 'active',
      description: 'RESTful API for external developers and applications',
      features: ['Component data', 'Assignment queries', 'Bulk operations', 'Webhooks']
    }
  ]);

  const apiEndpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/components',
      description: 'List all components with filtering options',
      authenticated: true,
      rateLimited: true
    },
    {
      method: 'POST',
      path: '/api/v1/assignments',
      description: 'Create component assignments',
      authenticated: true,
      rateLimited: true
    },
    {
      method: 'GET',
      path: '/api/v1/models/{id}/components',
      description: 'Get components for a specific model',
      authenticated: false,
      rateLimited: true
    },
    {
      method: 'PUT',
      path: '/api/v1/configurations/{id}',
      description: 'Update configuration components',
      authenticated: true,
      rateLimited: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Database className="h-4 w-4" />;
      case 'catalog': return <Globe className="h-4 w-4" />;
      case 'supplier': return <Plug className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      default: return <Cloud className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'POST': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'DELETE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const renderIntegrationCard = (integration: Integration) => (
    <Card key={integration.id} className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2 mb-2">
              {getTypeIcon(integration.type)}
              {integration.name}
            </CardTitle>
            <p className="text-sm text-explorer-text-muted">{integration.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(integration.status)}>
              {getStatusIcon(integration.status)}
              <span className="ml-1 capitalize">{integration.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {integration.endpoint && (
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink className="h-3 w-3 text-explorer-text-muted" />
            <code className="text-xs bg-explorer-dark px-2 py-1 rounded">{integration.endpoint}</code>
          </div>
        )}

        {integration.lastSync && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-explorer-text-muted">Last Sync</span>
              <div className="text-explorer-text font-medium">{integration.lastSync}</div>
            </div>
            <div>
              <span className="text-explorer-text-muted">Frequency</span>
              <div className="text-explorer-text font-medium">{integration.syncFrequency}</div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-explorer-text">Features:</h4>
          <div className="flex flex-wrap gap-1">
            {integration.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-explorer-chrome/30">
          <div className="flex items-center gap-2">
            <Switch 
              checked={integration.status === 'active'} 
              disabled={integration.status === 'error'}
            />
            <span className="text-sm text-explorer-text-muted">Enabled</span>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <Plug className="h-5 w-5 text-accent-teal" />
            Integration Hub
          </CardTitle>
          <p className="text-sm text-explorer-text-muted">
            Manage external integrations, APIs, and mobile access
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api">API Endpoints</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map(renderIntegrationCard)}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-lg">API Endpoints</CardTitle>
              <p className="text-sm text-explorer-text-muted">
                Available REST API endpoints for external integration
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-explorer-dark rounded border border-explorer-chrome/30">
                    <div className="flex items-center gap-3">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm">{endpoint.path}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      {endpoint.authenticated && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Auth
                        </Badge>
                      )}
                      {endpoint.rateLimited && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Rate Limited
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="pt-6 text-center">
              <Smartphone className="h-12 w-12 text-accent-teal mx-auto mb-4" />
              <h3 className="text-lg font-medium text-explorer-text mb-2">Mobile Optimization</h3>
              <p className="text-explorer-text-muted mb-6">
                Enhanced mobile interface for field technicians and mechanics
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-explorer-dark rounded">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-medium text-explorer-text">Responsive Design</h4>
                  <p className="text-sm text-explorer-text-muted">Optimized for all screen sizes</p>
                </div>
                <div className="text-center p-4 bg-explorer-dark rounded">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-medium text-explorer-text">Offline Support</h4>
                  <p className="text-sm text-explorer-text-muted">Work without internet connection</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 text-accent-teal mx-auto mb-4" />
              <h3 className="text-lg font-medium text-explorer-text mb-2">Security & Access Control</h3>
              <p className="text-explorer-text-muted mb-6">
                Secure API access with authentication and rate limiting
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-explorer-dark rounded">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-medium text-explorer-text">API Keys</h4>
                  <p className="text-sm text-explorer-text-muted">Secure authentication</p>
                </div>
                <div className="text-center p-4 bg-explorer-dark rounded">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-medium text-explorer-text">Rate Limiting</h4>
                  <p className="text-sm text-explorer-text-muted">Usage controls</p>
                </div>
                <div className="text-center p-4 bg-explorer-dark rounded">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-medium text-explorer-text">Audit Logs</h4>
                  <p className="text-sm text-explorer-text-muted">Activity tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationHub;
