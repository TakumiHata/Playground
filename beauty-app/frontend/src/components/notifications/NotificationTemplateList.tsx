import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  DialogContentText,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  History as HistoryIcon,
  FilterList as FilterListIcon,
  Compare as CompareIcon,
} from '@mui/icons-material';
import PreviewIcon from '@mui/icons-material/Preview';
import { notificationTemplateApi, NotificationTemplate, TemplateHistory } from '../../api/notificationTemplateApi';
import { useNavigate } from 'react-router-dom';

export default function NotificationTemplateList() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [formData, setFormData] = useState({
    type: 'email' as 'email' | 'sms',
    name: '',
    subject: '',
    content: '',
    variables: [] as string[],
  });
  const [previewTab, setPreviewTab] = useState(0);
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({});
  const [previewResult, setPreviewResult] = useState<{ subject: string; content: string } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateName, setDuplicateName] = useState('');
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [templateHistory, setTemplateHistory] = useState<TemplateHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [originalTemplate, setOriginalTemplate] = useState<NotificationTemplate | null>(null);
  const [originalTemplateLoading, setOriginalTemplateLoading] = useState(false);
  const [originalTemplateError, setOriginalTemplateError] = useState<string | null>(null);
  const [initialVariables, setInitialVariables] = useState<Record<string, string>>({});
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('');
  const [filterName, setFilterName] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState<NotificationTemplate[]>([]);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [selectedTemplateForCompare, setSelectedTemplateForCompare] = useState<NotificationTemplate | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await notificationTemplateApi.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError('テンプレートの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      type: template.type,
      name: template.name,
      subject: template.subject,
      content: template.content,
      variables: template.variables,
    });
    setPreviewVariables({});
    setPreviewResult(null);
    setPreviewError(null);
    setEditDialogOpen(true);
  };

  const handleDelete = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;

    try {
      await notificationTemplateApi.updateTemplate(selectedTemplate.id, formData);
      setEditDialogOpen(false);
      fetchTemplates();
    } catch (err) {
      setError('テンプレートの更新に失敗しました');
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTemplate) return;

    try {
      await notificationTemplateApi.deleteTemplate(selectedTemplate.id);
      setDeleteDialogOpen(false);
      fetchTemplates();
    } catch (err) {
      setError('テンプレートの削除に失敗しました');
      console.error(err);
    }
  };

  const handlePreview = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setPreviewDialogOpen(true);
    setPreviewVariables({});
    setPreviewResult(null);
    setPreviewError(null);
  };

  const handlePreviewGenerate = async () => {
    if (!selectedTemplate) return;

    try {
      setPreviewLoading(true);
      const result = await notificationTemplateApi.previewTemplate({
        templateId: selectedTemplate.id,
        variables: previewVariables,
      });
      setPreviewResult(result);
    } catch (err) {
      setPreviewError('プレビューの生成に失敗しました');
      console.error(err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDuplicate = async (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    const baseName = template.name.replace(/（コピー\d*）$/, '');
    const existingCopies = templates
      .filter(t => t.name.startsWith(baseName) && t.name !== template.name)
      .map(t => {
        const match = t.name.match(/（コピー(\d+)）$/);
        return match ? parseInt(match[1]) : 1;
      });
    const newNumber = existingCopies.length > 0 ? Math.max(...existingCopies) + 1 : 1;
    setDuplicateName(`${baseName}（コピー${newNumber}）`);
    
    // 変数の初期値を空文字列で初期化
    const initialVars: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialVars[variable] = '';
    });
    setInitialVariables(initialVars);
    
    setDuplicateDialogOpen(true);
  };

  const handleDuplicateNameChange = (name: string) => {
    setDuplicateName(name);
    setDuplicateError(null);

    // 重複チェック
    const isDuplicate = templates.some(template => 
      template.name === name && template.id !== selectedTemplate?.id
    );

    if (isDuplicate) {
      setDuplicateError('この名前は既に使用されています');
    }
  };

  const handleInitialVariableChange = (variable: string, value: string) => {
    setInitialVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleDuplicateConfirm = async () => {
    if (!selectedTemplate) return;

    // 重複チェック
    const isDuplicate = templates.some(template => 
      template.name === duplicateName && template.id !== selectedTemplate.id
    );

    if (isDuplicate) {
      setDuplicateError('この名前は既に使用されています');
      return;
    }

    try {
      setLoading(true);
      const duplicatedTemplate = await notificationTemplateApi.duplicateTemplate(selectedTemplate.id);
      
      // テンプレート名と変数の初期値を更新
      await notificationTemplateApi.updateTemplate(duplicatedTemplate.id, { 
        name: duplicateName,
        initialVariables
      });
      
      setDuplicateDialogOpen(false);
      await fetchTemplates();
    } catch (err) {
      setError('テンプレートの複製に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowHistory = async (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setHistoryDialogOpen(true);
    setHistoryLoading(true);
    setHistoryError(null);
    setOriginalTemplateLoading(true);
    setOriginalTemplateError(null);

    try {
      const [history, original] = await Promise.all([
        notificationTemplateApi.getTemplateHistory(template.id),
        notificationTemplateApi.getTemplate(template.id)
      ]);
      setTemplateHistory(history);
      setOriginalTemplate(original);
    } catch (err) {
      setHistoryError('履歴の取得に失敗しました');
      setOriginalTemplateError('テンプレートの取得に失敗しました');
      console.error(err);
    } finally {
      setHistoryLoading(false);
      setOriginalTemplateLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = [...templates];
    
    if (filterType) {
      filtered = filtered.filter(template => template.type === filterType);
    }
    
    if (filterName) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    
    setFilteredTemplates(filtered);
    setFilterDialogOpen(false);
  };

  const handleCompare = (template: NotificationTemplate) => {
    setSelectedTemplateForCompare(template);
    setCompareDialogOpen(true);
  };

  const renderDiff = (original: string, modified: string) => {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');
    const maxLines = Math.max(originalLines.length, modifiedLines.length);
    
    return (
      <Box sx={{ fontFamily: 'monospace' }}>
        {Array.from({ length: maxLines }).map((_, i) => {
          const originalLine = originalLines[i] || '';
          const modifiedLine = modifiedLines[i] || '';
          
          if (originalLine === modifiedLine) {
            return <div key={i}>{originalLine}</div>;
          }
          
          return (
            <div key={i}>
              <span style={{ color: 'red', textDecoration: 'line-through' }}>
                {originalLine}
              </span>
              <br />
              <span style={{ color: 'green' }}>
                {modifiedLine}
              </span>
            </div>
          );
        })}
      </Box>
    );
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">通知テンプレート一覧</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/notifications/new')}
        >
          新規テンプレート
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>テンプレート名</TableCell>
              <TableCell>種類</TableCell>
              <TableCell>件名</TableCell>
              <TableCell>最終更新日</TableCell>
              <TableCell>更新者</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell>{template.name}</TableCell>
                <TableCell>
                  <Chip
                    label={template.type === 'email' ? 'メール' : 'SMS'}
                    color={template.type === 'email' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{template.subject}</TableCell>
                <TableCell>{template.lastModified}</TableCell>
                <TableCell>{template.modifiedBy}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/notifications/${template.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="info">
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton color="info">
                    <HistoryIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 