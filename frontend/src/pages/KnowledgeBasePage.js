import React from 'react';
import WorkspaceLayout from '../components/workspace/WorkspaceLayout';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, BookOpen, FileText, Upload } from 'lucide-react';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const KnowledgeBasePage = () => {
  const { user } = useAuth();
  
  const handleUpload = () => {
    toast.success('Upload article feature coming soon');
  };
  const categories = [
    { name: 'FAFSA', count: 2, color: 'bg-blue-100 text-blue-700' },
    { name: 'Verification', count: 1, color: 'bg-green-100 text-green-700' },
    { name: 'SAP Appeals', count: 1, color: 'bg-purple-100 text-purple-700' },
    { name: 'Billing', count: 1, color: 'bg-orange-100 text-orange-700' },
    { name: 'General', count: 2, color: 'bg-gray-100 text-gray-700' },
  ];

  const articles = [
    { title: 'FAFSA Submission Deadlines 2024-2025', category: 'FAFSA', updatedAt: '2 days ago' },
    { title: 'Verification Process - Required Documents', category: 'Verification', updatedAt: '1 week ago' },
    { title: 'Satisfactory Academic Progress (SAP) Appeals', category: 'SAP Appeals', updatedAt: '3 weeks ago' },
    { title: 'Understanding Your Billing Statement', category: 'Billing', updatedAt: '1 month ago' },
    { title: 'General Financial Aid Eligibility Requirements', category: 'General', updatedAt: '2 months ago' },
    { title: 'How to Complete the FAFSA', category: 'FAFSA', updatedAt: '2 months ago' },
    { title: 'Work-Study Program Information', category: 'General', updatedAt: '3 months ago' },
  ];

  return (
    <WorkspaceLayout user={user}>
      <div className="h-full bg-gray-50 overflow-auto" data-testid="knowledge-base-page">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Knowledge Base</h1>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={handleUpload} data-testid="upload-article-btn">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search articles..."
            className="pl-10 h-11"
          />
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Categories */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 text-left">
                  <span className="text-sm font-medium text-gray-900">All Articles</span>
                  <Badge variant="secondary">7</Badge>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 text-left"
                  >
                    <span className="text-sm text-gray-700">{category.name}</span>
                    <Badge className={category.color}>{category.count}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Articles List */}
          <div className="col-span-9">
            <div className="space-y-3">
              {articles.map((article, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base font-semibold text-gray-900 mb-1">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{article.category}</Badge>
                          <span className="text-xs text-gray-500">• Updated {article.updatedAt}</span>
                        </CardDescription>
                      </div>
                      <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default KnowledgeBasePage;
