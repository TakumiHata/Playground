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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HistoryIcon from '@mui/icons-material/History';
import FilterListIcon from '@mui/icons-material/FilterList';
import CompareIcon from '@mui/icons-material/Compare';
import { notificationTemplateApi, NotificationTemplate, TemplateHistory } from '../../api/notificationTemplateApi';

export const NotificationTemplateList: React.FC = () => {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">通知テンプレート</Typography>
        <Box>
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            フィルター
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedTemplate(null);
              setFormData({
                type: 'email',
                name: '',
                subject: '',
                content: '',
                variables: [],
              });
              setEditDialogOpen(true);
            }}
          >
            新規作成
          </Button>
        </Box>
      </Box>

      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
        <DialogTitle>テンプレートのフィルター</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>タイプ</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="タイプ"
            >
              <MenuItem value="">すべて</MenuItem>
              <MenuItem value="email">メール</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="名前"
            fullWidth
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleFilter} variant="contained">
            適用
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>テンプレートのプレビュー</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                変数の値を入力してください
              </Typography>
              {selectedTemplate.variables.map((variable) => (
                <TextField
                  key={variable}
                  margin="dense"
                  label={variable}
                  fullWidth
                  value={previewVariables[variable] || ''}
                  onChange={(e) => setPreviewVariables({
                    ...previewVariables,
                    [variable]: e.target.value
                  })}
                />
              ))}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handlePreviewGenerate}
                  disabled={previewLoading}
                >
                  プレビュー生成
                </Button>
              </Box>

              {previewLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress />
                </Box>
              )}

              {previewError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {previewError}
                </Alert>
              )}

              {previewResult && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    件名:
                  </Typography>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    {previewResult.subject}
                  </Paper>
                  <Typography variant="subtitle1" gutterBottom>
                    本文:
                  </Typography>
                  <Paper sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
                    {previewResult.content}
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={compareDialogOpen} 
        onClose={() => setCompareDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>テンプレートの差分</DialogTitle>
        <DialogContent>
          {selectedTemplate && selectedTemplateForCompare && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  {selectedTemplate.name}
                </Typography>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    件名:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedTemplate.subject}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    本文:
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedTemplate.content}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  {selectedTemplateForCompare.name}
                </Typography>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    件名:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {renderDiff(selectedTemplate.subject, selectedTemplateForCompare.subject)}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    本文:
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {renderDiff(selectedTemplate.content, selectedTemplateForCompare.content)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompareDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>名前</TableCell>
              <TableCell>タイプ</TableCell>
              <TableCell>件名</TableCell>
              <TableCell>変数</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(filteredTemplates.length > 0 ? filteredTemplates : templates).map((template) => (
              <TableRow key={template.id}>
                <TableCell>{template.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={template.type === 'email' ? 'メール' : 'SMS'} 
                    color={template.type === 'email' ? 'primary' : 'secondary'} 
                  />
                </TableCell>
                <TableCell>{template.subject}</TableCell>
                <TableCell>
                  {template.variables.map((variable) => (
                    <Chip 
                      key={variable} 
                      label={variable} 
                      size="small" 
                      sx={{ mr: 0.5, mb: 0.5 }} 
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(template)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handlePreview(template)}>
                    <PreviewIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDuplicate(template)}>
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton onClick={() => handleShowHistory(template)}>
                    <HistoryIcon />
                  </IconButton>
                  <IconButton onClick={() => handleCompare(template)}>
                    <CompareIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(template)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTemplate ? 'テンプレートの編集' : '新規テンプレートの作成'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={previewTab} onChange={(_, newValue) => setPreviewTab(newValue)}>
            <Tab label="編集" />
            <Tab label="プレビュー" />
          </Tabs>

          {previewTab === 0 ? (
            <>
              <TextField
                margin="dense"
                label="名前"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                margin="dense"
                label="タイプ"
                select
                fullWidth
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'email' | 'sms' })}
              >
                <MenuItem value="email">メール</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
              </TextField>
              <TextField
                margin="dense"
                label="件名"
                fullWidth
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
              <TextField
                margin="dense"
                label="本文"
                fullWidth
                multiline
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <TextField
                margin="dense"
                label="変数"
                fullWidth
                value={formData.variables.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    variables: e.target.value.split(',').map((v) => v.trim()),
                  })
                }
                helperText="カンマ区切りで変数を入力してください"
              />
            </>
          ) : (
            <Box sx={{ mt: 2 }}>
              {formData.variables.map((variable) => (
                <TextField
                  key={variable}
                  margin="dense"
                  label={variable}
                  fullWidth
                  value={previewVariables[variable] || ''}
                  onChange={(e) =>
                    setPreviewVariables({ ...previewVariables, [variable]: e.target.value })
                  }
                />
              ))}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<PreviewIcon />}
                  onClick={handlePreview}
                  disabled={previewLoading}
                >
                  プレビュー
                </Button>
              </Box>

              {previewLoading && <CircularProgress />}

              {previewError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {previewError}
                </Alert>
              )}

              {previewResult && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    件名:
                  </Typography>
                  <Paper sx={{ p: 2, mb: 2 }}>{previewResult.subject}</Paper>

                  <Typography variant="subtitle1" gutterBottom>
                    本文:
                  </Typography>
                  <Paper sx={{ p: 2, whiteSpace: 'pre-wrap' }}>{previewResult.content}</Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>テンプレートの削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedTemplate?.name}を削除してもよろしいですか？
            この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            削除
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={duplicateDialogOpen} onClose={() => setDuplicateDialogOpen(false)}>
        <DialogTitle>テンプレートの複製</DialogTitle>
        <DialogContent>
          <DialogContentText>
            複製するテンプレートの名前を入力し、変数の初期値を設定してください。
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="テンプレート名"
            fullWidth
            value={duplicateName}
            onChange={(e) => handleDuplicateNameChange(e.target.value)}
            error={!!duplicateError}
            helperText={duplicateError}
          />
          
          {selectedTemplate && selectedTemplate.variables.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                変数の初期値
              </Typography>
              {selectedTemplate.variables.map((variable) => (
                <TextField
                  key={variable}
                  margin="dense"
                  label={variable}
                  fullWidth
                  value={initialVariables[variable] || ''}
                  onChange={(e) => handleInitialVariableChange(variable, e.target.value)}
                  helperText={`${variable}の初期値を設定します`}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDuplicateDialogOpen(false)}>キャンセル</Button>
          <Button 
            onClick={handleDuplicateConfirm} 
            variant="contained"
            disabled={!!duplicateError}
          >
            複製
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={historyDialogOpen} 
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTemplate?.name} の複製履歴
        </DialogTitle>
        <DialogContent>
          {historyLoading || originalTemplateLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : historyError || originalTemplateError ? (
            <Alert severity="error">{historyError || originalTemplateError}</Alert>
          ) : (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  複製元テンプレート
                </Typography>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    名前: {originalTemplate?.name}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    タイプ: {originalTemplate?.type}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    件名: {originalTemplate?.subject}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    変数: {originalTemplate?.variables.join(', ')}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    作成日時: {originalTemplate?.createdAt && new Date(originalTemplate.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1">
                    更新日時: {originalTemplate?.updatedAt && new Date(originalTemplate.updatedAt).toLocaleString()}
                  </Typography>
                </Paper>
              </Box>

              <Typography variant="h6" gutterBottom>
                複製履歴
              </Typography>
              {templateHistory.length === 0 ? (
                <Typography>複製履歴はありません</Typography>
              ) : (
                <List>
                  {templateHistory.map((history) => (
                    <ListItem key={history.id} divider>
                      <ListItemText
                        primary={`${history.originalName} → ${history.newName}`}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              複製日時: {new Date(history.duplicatedAt).toLocaleString()}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span">
                              複製者: {history.duplicatedBy}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 