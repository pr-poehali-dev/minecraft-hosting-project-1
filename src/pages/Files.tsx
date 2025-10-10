import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  content?: string;
}

const Files = () => {
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editorDialogOpen, setEditorDialogOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState('');
  
  const [files, setFiles] = useState<Record<string, FileItem[]>>({
    '/': [
      { name: 'plugins', type: 'folder', modified: '2025-01-10 15:30' },
      { name: 'world', type: 'folder', modified: '2025-01-10 14:20' },
      { 
        name: 'server.properties', 
        type: 'file', 
        size: '1.2 KB', 
        modified: '2025-01-10 12:00',
        content: `# Minecraft server properties\nserver-port=25565\nmax-players=20\nmotd=BlazeLegacy Server\ngamemode=survival\ndifficulty=normal\npvp=true\nonline-mode=true\nwhite-list=false`
      },
      { 
        name: 'ops.json', 
        type: 'file', 
        size: '156 B', 
        modified: '2025-01-10 11:45',
        content: `[\n  {\n    "uuid": "uuid-here",\n    "name": "Admin",\n    "level": 4\n  }\n]`
      },
      { 
        name: 'banned-players.json', 
        type: 'file', 
        size: '2 B', 
        modified: '2025-01-09 18:30',
        content: '[]'
      },
      { 
        name: 'whitelist.json', 
        type: 'file', 
        size: '89 B', 
        modified: '2025-01-09 16:20',
        content: `[\n  {\n    "uuid": "uuid-here",\n    "name": "Player1"\n  }\n]`
      },
    ],
    '/plugins': [
      { name: 'EssentialsX.jar', type: 'file', size: '2.4 MB', modified: '2025-01-08 10:00' },
      { name: 'WorldEdit.jar', type: 'file', size: '5.1 MB', modified: '2025-01-08 10:00' },
      { name: 'LuckPerms.jar', type: 'file', size: '3.8 MB', modified: '2025-01-08 10:00' },
    ],
    '/world': [
      { name: 'region', type: 'folder', modified: '2025-01-10 14:20' },
      { name: 'level.dat', type: 'file', size: '4.5 KB', modified: '2025-01-10 14:20' },
      { name: 'session.lock', type: 'file', size: '8 B', modified: '2025-01-10 14:20' },
    ],
  });

  const currentFiles = files[currentPath] || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const newFiles: FileItem[] = [];
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      newFiles.push({
        name: file.name,
        type: 'file',
        size: formatFileSize(file.size),
        modified: new Date().toLocaleString('ru-RU', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', '')
      });
    }

    setFiles(prev => ({
      ...prev,
      [currentPath]: [...(prev[currentPath] || []), ...newFiles]
    }));

    toast.success(`Загружено файлов: ${uploadedFiles.length}`);
    setUploadDialogOpen(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: FileItem = {
      name: newFolderName,
      type: 'folder',
      modified: new Date().toLocaleString('ru-RU', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', '')
    };

    setFiles(prev => ({
      ...prev,
      [currentPath]: [...(prev[currentPath] || []), newFolder],
      [`${currentPath}${newFolderName}`]: []
    }));

    toast.success(`Папка "${newFolderName}" создана`);
    setNewFolderName('');
    setNewFolderDialogOpen(false);
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      setCurrentPath(newPath);
    } else {
      handleEditFile(item);
    }
  };
  
  const handleEditFile = (item: FileItem) => {
    const isEditable = item.name.endsWith('.properties') || 
                       item.name.endsWith('.json') || 
                       item.name.endsWith('.yml') ||
                       item.name.endsWith('.yaml') ||
                       item.name.endsWith('.txt') ||
                       item.name.endsWith('.cfg');
    
    if (!isEditable) {
      toast.error('Этот тип файла нельзя редактировать');
      return;
    }
    
    setEditingFile(item);
    setFileContent(item.content || '');
    setEditorDialogOpen(true);
  };
  
  const handleSaveFile = () => {
    if (!editingFile) return;
    
    setFiles(prev => ({
      ...prev,
      [currentPath]: prev[currentPath].map(f => 
        f.name === editingFile.name 
          ? { ...f, content: fileContent, modified: new Date().toLocaleString('ru-RU', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }).replace(',', '') }
          : f
      )
    }));
    
    toast.success(`Файл "${editingFile.name}" сохранён`);
    setEditorDialogOpen(false);
    setEditingFile(null);
    setFileContent('');
  };

  const handleGoBack = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.length === 0 ? '/' : '/' + parts.join('/'));
  };

  const handleDelete = (item: FileItem) => {
    setFiles(prev => ({
      ...prev,
      [currentPath]: prev[currentPath].filter(f => f.name !== item.name)
    }));
    toast.success(`${item.type === 'folder' ? 'Папка' : 'Файл'} "${item.name}" удалён`);
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') return 'Folder';
    if (item.name.endsWith('.jar')) return 'Package';
    if (item.name.endsWith('.json')) return 'FileJson';
    if (item.name.endsWith('.properties')) return 'Settings';
    if (item.name.endsWith('.dat')) return 'Database';
    return 'File';
  };

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-secondary"
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Icon name="FolderOpen" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Файловый менеджер</h1>
              <p className="text-sm text-muted-foreground">BlazeLegacy</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="HardDrive" size={20} />
                <span>Файлы сервера</span>
              </div>
              <div className="flex gap-2">
                <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Icon name="FolderPlus" size={16} className="mr-2" />
                      Новая папка
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Создать папку</DialogTitle>
                      <DialogDescription>
                        Введите название новой папки
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="folder-name">Название папки</Label>
                        <Input
                          id="folder-name"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="my-folder"
                          onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                        />
                      </div>
                      <Button onClick={handleCreateFolder} className="w-full">
                        Создать
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-accent hover:bg-accent/90">
                      <Icon name="Upload" size={16} className="mr-2" />
                      Загрузить
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Загрузить файлы</DialogTitle>
                      <DialogDescription>
                        Выберите файлы для загрузки в {currentPath}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <span className="text-primary hover:underline">Выберите файлы</span>
                          <span className="text-muted-foreground"> или перетащите сюда</span>
                        </Label>
                        <Input
                          id="file-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".jar,.json,.properties,.yml,.yaml,.txt,.dat"
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="HardDrive" size={16} />
              <span 
                className="cursor-pointer hover:text-foreground"
                onClick={() => setCurrentPath('/')}
              >
                /
              </span>
              {breadcrumbs.map((crumb, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon name="ChevronRight" size={14} />
                  <span className="text-foreground">{crumb}</span>
                </div>
              ))}
            </div>

            {currentPath !== '/' && (
              <div 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                onClick={handleGoBack}
              >
                <Icon name="CornerUpLeft" size={20} className="text-muted-foreground" />
                <span className="font-medium">..</span>
              </div>
            )}

            <div className="space-y-2">
              {currentFiles.map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors group"
                >
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <Icon 
                      name={getFileIcon(item)} 
                      size={24} 
                      className={item.type === 'folder' ? 'text-primary' : 'text-muted-foreground'} 
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground flex gap-4">
                        {item.size && <span>{item.size}</span>}
                        <span>{item.modified}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.type === 'file' && (
                      item.name.endsWith('.properties') || 
                      item.name.endsWith('.json') || 
                      item.name.endsWith('.yml') ||
                      item.name.endsWith('.yaml') ||
                      item.name.endsWith('.txt') ||
                      item.name.endsWith('.cfg')
                    ) && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditFile(item)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toast.info('Функция скачивания')}
                    >
                      <Icon name="Download" size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                      onClick={() => handleDelete(item)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {currentFiles.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="FolderOpen" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Папка пуста</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={editorDialogOpen} onOpenChange={setEditorDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icon name="FileEdit" size={20} />
                Редактор файла: {editingFile?.name}
              </DialogTitle>
              <DialogDescription>
                Редактируйте содержимое файла. Изменения вступят в силу после сохранения.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="font-mono text-sm h-96 resize-none"
                placeholder="Содержимое файла..."
              />
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditorDialogOpen(false);
                    setEditingFile(null);
                    setFileContent('');
                  }}
                >
                  Отмена
                </Button>
                <Button onClick={handleSaveFile} className="bg-accent hover:bg-accent/90">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Files" size={20} className="text-primary" />
                <div className="text-sm text-muted-foreground">ВСЕГО ФАЙЛОВ</div>
              </div>
              <div className="text-2xl font-bold">
                {currentFiles.filter(f => f.type === 'file').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Folder" size={20} className="text-primary" />
                <div className="text-sm text-muted-foreground">ПАПОК</div>
              </div>
              <div className="text-2xl font-bold">
                {currentFiles.filter(f => f.type === 'folder').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="HardDrive" size={20} className="text-primary" />
                <div className="text-sm text-muted-foreground">ИСПОЛЬЗОВАНО</div>
              </div>
              <div className="text-2xl font-bold">65.73 MiB</div>
              <div className="text-xs text-muted-foreground">из 10 GiB</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Files;