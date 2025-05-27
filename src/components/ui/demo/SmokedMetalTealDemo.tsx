
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bike, Settings, Zap, Shield, Star } from 'lucide-react';

/**
 * Demo component showcasing the Smoked Metal Teal design system
 * Demonstrates glass morphism, teal accents, and metallic effects
 */
export default function SmokedMetalTealDemo() {
  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="container-glass">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-gradient-teal mb-4">
            Smoked Metal Teal Design System
          </h1>
          <p className="text-secondary-muted max-w-2xl mx-auto">
            A modern, high-end UI design system inspired by motorcycles and tech aesthetics. 
            Featuring frosted glass components, metallic accents, and teal highlights.
          </p>
        </div>

        {/* Component Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Glass Card */}
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-primary" />
                Glass Card
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-muted">
                Frosted glass effect with subtle borders and hover animations.
              </p>
              <div className="mt-4 flex gap-2">
                <Badge variant="teal">Frosted</Badge>
                <Badge variant="outline">Interactive</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Button Showcase */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Button Variants
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="button-primary w-full">
                Primary Teal
              </Button>
              <Button className="button-secondary w-full">
                Secondary Glass
              </Button>
              <Button className="button-metallic w-full">
                Metallic Outline
              </Button>
            </CardContent>
          </Card>

          {/* Input Showcase */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Form Elements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input 
                placeholder="Glass input field..." 
                className="input-glass"
              />
              <div className="glass-morphism p-3 rounded-lg">
                <p className="text-sm text-secondary">
                  Glass morphism container with backdrop blur
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Typography Showcase */}
        <Card className="card mb-12">
          <CardHeader>
            <CardTitle>Typography Hierarchy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h1>Heading 1 - Main Titles</h1>
              <h2>Heading 2 - Section Titles</h2>
              <h3>Heading 3 - Subsections</h3>
              <h4>Heading 4 - Component Titles</h4>
              <h5>Heading 5 - Labels</h5>
              <h6>Heading 6 - Captions</h6>
              <p>Body text with proper line spacing and secondary color treatment.</p>
            </div>
          </CardContent>
        </Card>

        {/* Effect Demonstrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Glow Effects */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Glow Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="glow-idle p-4 rounded-lg bg-glass text-center">
                Subtle Glow
              </div>
              <div className="glow-active p-4 rounded-lg bg-glass text-center">
                Active Glow Pulse
              </div>
              <Button className="button-primary w-full glow-on-hover">
                Hover for Glow
              </Button>
            </CardContent>
          </Card>

          {/* Glass Variants */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Glass Variants
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="glass-light p-4 rounded-lg text-center">
                Light Glass
              </div>
              <div className="glass-medium p-4 rounded-lg text-center">
                Medium Glass
              </div>
              <div className="glass-heavy p-4 rounded-lg text-center">
                Heavy Glass
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metallic Table Demo */}
        <Card className="card">
          <CardHeader>
            <CardTitle>Metallic Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-metallic">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Feature</th>
                    <th className="text-left">Description</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Glass Morphism</td>
                    <td>Frosted glass effects with backdrop blur</td>
                    <td><Badge variant="teal">Active</Badge></td>
                  </tr>
                  <tr>
                    <td>Teal Accents</td>
                    <td>Primary color system with glow effects</td>
                    <td><Badge variant="teal">Active</Badge></td>
                  </tr>
                  <tr>
                    <td>Metallic Highlights</td>
                    <td>Subtle shine and hover effects</td>
                    <td><Badge variant="teal">Active</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-secondary-muted">
            Smoked Metal Teal Design System • Dark Mode First • Frosted Glass Components
          </p>
        </div>
      </div>
    </div>
  );
}
