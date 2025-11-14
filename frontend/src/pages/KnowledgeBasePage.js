import React, { useState } from 'react';
import WorkspaceLayout from '../components/workspace/WorkspaceLayout';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, FileText, Upload, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const KnowledgeBasePage = () => {
  const { user } = useAuth();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState('article');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState('general');
  const [articleContent, setArticleContent] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = () => {
    setShowUploadDialog(true);
  };
  
  const handleSubmitUpload = async () => {
    if (uploadType === 'article') {
      if (!articleTitle.trim() || !articleContent.trim()) {
        toast.error('Please enter title and content');
        return;
      }
    } else {
      if (!linkTitle.trim() || !linkUrl.trim()) {
        toast.error('Please enter title and URL');
        return;
      }
    }
    
    setUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (uploadType === 'article') {
      toast.success(`Article "${articleTitle}" uploaded successfully`);
    } else {
      toast.success(`Link "${linkTitle}" added successfully`);
    }
    
    // Reset form
    setShowUploadDialog(false);
    setArticleTitle('');
    setArticleContent('');
    setLinkTitle('');
    setLinkUrl('');
    setUploading(false);
  };
  
  const categories = [
    { name: 'FAFSA', count: 2, color: 'bg-blue-100 text-blue-700' },
    { name: 'Verification', count: 1, color: 'bg-green-100 text-green-700' },
    { name: 'SAP Appeals', count: 1, color: 'bg-purple-100 text-purple-700' },
    { name: 'Billing', count: 1, color: 'bg-orange-100 text-orange-700' },
    { name: 'General', count: 2, color: 'bg-gray-100 text-gray-700' },
  ];

  const articles = [
    { 
      id: '1',
      title: 'FAFSA Submission Deadlines 2024-2025', 
      category: 'FAFSA', 
      type: 'Article',
      lastUpdated: '2 days ago',
      updatedBy: 'Sarah Chen'
    },
    { 
      id: '2',
      title: 'Verification Process - Required Documents', 
      category: 'Verification', 
      type: 'Article',
      lastUpdated: '1 week ago',
      updatedBy: 'Michael Rodriguez'
    },
    { 
      id: '3',
      title: 'Satisfactory Academic Progress (SAP) Appeals', 
      category: 'SAP Appeals', 
      type: 'Article',
      lastUpdated: '3 weeks ago',
      updatedBy: 'Dr. Emily Thompson'
    },
    { 
      id: '4',
      title: 'Understanding Your Billing Statement', 
      category: 'Billing', 
      type: 'Article',
      lastUpdated: '1 month ago',
      updatedBy: 'Sarah Chen'
    },
    { 
      id: '5',
      title: 'Federal Student Aid Website', 
      category: 'General', 
      type: 'Link',
      lastUpdated: '2 months ago',
      updatedBy: 'Michael Rodriguez'
    },
    { 
      id: '6',
      title: 'How to Complete the FAFSA', 
      category: 'FAFSA', 
      type: 'Article',
      lastUpdated: '2 months ago',
      updatedBy: 'Dr. Emily Thompson'
    },
    { 
      id: '7',
      title: 'Work-Study Program Information', 
      category: 'General', 
      type: 'Article',
      lastUpdated: '3 months ago',
      updatedBy: 'Sarah Chen'
    },
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

          {/* Main Content - Articles Table */}
          <div className="col-span-9">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Articles & Links</CardTitle>
                <CardDescription>Knowledge base content for AI-powered replies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Updated</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Updated By</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {articles.map((article) => (
                        <tr key={article.id} className="hover:bg-gray-50 cursor-pointer">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {article.type === 'Link' ? (
                                <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              ) : (
                                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              )}
                              <span className="text-sm font-medium text-gray-900">{article.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-xs">{article.category}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-700">{article.type}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs text-gray-500">{article.lastUpdated}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs text-gray-600">{article.updatedBy}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="h-7 text-xs">
                                Edit
                              </Button>
                              {article.type === 'Link' && (
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
      
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload to Knowledge Base</DialogTitle>
            <DialogDescription>
              Add a new article or external link to the knowledge base
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Upload Type */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">Type</label>
              <Select value={uploadType} onValueChange={setUploadType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="link">External Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {uploadType === 'article' ? (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Title</label>
                  <Input
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    placeholder="e.g., FAFSA Deadline Information"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Category</label>
                  <Select value={articleCategory} onValueChange={setArticleCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fafsa">FAFSA</SelectItem>
                      <SelectItem value="verification">Verification</SelectItem>
                      <SelectItem value="sap_appeal">SAP Appeals</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="deadlines">Deadlines</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Content (Markdown)</label>
                  <Textarea
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    rows={10}
                    placeholder="# Article Title\n\nArticle content in markdown format..."
                    className="font-mono text-sm"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Link Title</label>
                  <Input
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="e.g., Federal Student Aid Website"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">URL</label>
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                    type="url"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Category</label>
                  <Select value={articleCategory} onValueChange={setArticleCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fafsa">FAFSA</SelectItem>
                      <SelectItem value="verification">Verification</SelectItem>
                      <SelectItem value="sap_appeal">SAP Appeals</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="deadlines">Deadlines</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUploadDialog(false);
                setArticleTitle('');
                setArticleContent('');
                setLinkTitle('');
                setLinkUrl('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitUpload}
              disabled={uploading}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              {uploading ? 'Uploading...' : uploadType === 'article' ? 'Upload Article' : 'Add Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WorkspaceLayout>
  );
};

export default KnowledgeBasePage;
