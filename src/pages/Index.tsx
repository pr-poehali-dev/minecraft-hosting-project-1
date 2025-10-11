import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Index = () => {
  const navigate = useNavigate();
  const [showConsole, setShowConsole] = useState(false);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'starting'>('offline');
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [cpuLoad, setCpuLoad] = useState(0);
  const [diskUsage, setDiskUsage] = useState(65.73);
  const [ramPlan, setRamPlan] = useState(4);
  const [pauseTime, setPauseTime] = useState(3600);
  const [consoleTab, setConsoleTab] = useState('all');
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleLines, setConsoleLines] = useState<Array<{text: string, type: 'log' | 'error' | 'command' | 'player'}>>([
    {text: 'containerDeceiverHost: server marked as offline', type: 'log'}
  ]);
  const [buildDialogOpen, setBuildDialogOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('1.20.1');
  const [selectedBuild, setSelectedBuild] = useState('paper');
  const [currentVersion, setCurrentVersion] = useState('1.20.1 Paper');
  const [isInstalling, setIsInstalling] = useState(false);
  
  const [playerData] = useState([
    { time: '21h', players: 0 },
    { time: '22h', players: 2 },
    { time: '23h', players: 3 },
    { time: '00h', players: 1 },
    { time: '01h', players: 0 },
    { time: '02h', players: 1 },
    { time: '03h', players: 3 },
    { time: '04h', players: 0 }
  ]);

  const ramOptions = [
    { value: 4, label: '4 GiB', price: 0 },
    { value: 8, label: '8 GiB', price: 2 },
    { value: 12, label: '12 GiB', price: 4 },
    { value: 16, label: '16 GiB', price: 6 },
    { value: 24, label: '24 GiB', price: 10 },
    { value: 32, label: '32 GiB', price: 14 }
  ];

  const handleStart = () => {
    setServerStatus('starting');
    setConsoleLines(prev => [...prev, {text: '> Starting server...', type: 'command'}]);
    setTimeout(() => {
      setServerStatus('online');
      setMemoryUsage(45);
      setCpuLoad(23);
      setConsoleLines(prev => [
        ...prev, 
        {text: 'Server started successfully!', type: 'log'},
        {text: '[INFO] Loading spawn chunks...', type: 'log'},
        {text: 'Player Steve joined the game', type: 'player'}
      ]);
      toast.success('Сервер запущен');
    }, 2000);
  };

  const handleRestart = () => {
    setServerStatus('starting');
    setConsoleLines(prev => [...prev, {text: '> Restarting server...', type: 'command'}]);
    setTimeout(() => {
      setServerStatus('online');
      setConsoleLines(prev => [
        ...prev, 
        {text: 'Server restarted successfully!', type: 'log'},
        {text: '[WARN] Server reloaded, some plugins may not work correctly', type: 'error'}
      ]);
      toast.success('Сервер перезапущен');
    }, 2000);
  };

  const handleStop = () => {
    setServerStatus('offline');
    setMemoryUsage(0);
    setCpuLoad(0);
    setConsoleLines(prev => [
      ...prev, 
      {text: '> Stopping server...', type: 'command'},
      {text: 'Saving worlds...', type: 'log'},
      {text: 'Player Steve left the game', type: 'player'},
      {text: 'Server stopped.', type: 'log'}
    ]);
    toast.error('Сервер остановлен');
  };
  
  const handleSendCommand = () => {
    if (!consoleInput.trim()) return;
    setConsoleLines(prev => [...prev, {text: `> ${consoleInput}`, type: 'command'}]);
    
    setTimeout(() => {
      setConsoleLines(prev => [...prev, {text: `Command executed: ${consoleInput}`, type: 'log'}]);
    }, 100);
    
    setConsoleInput('');
  };
  
  const filteredLines = consoleLines.filter(line => {
    if (consoleTab === 'all') return true;
    if (consoleTab === 'errors') return line.type === 'error';
    if (consoleTab === 'commands') return line.type === 'command';
    if (consoleTab === 'players') return line.type === 'player';
    return true;
  });
  
  const getLineColor = (type: string) => {
    switch(type) {
      case 'command': return 'text-primary';
      case 'error': return 'text-destructive';
      case 'player': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setPauseTime(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleRenew = () => {
    setPauseTime(3600);
    toast.success('Время продлено на 1 час');
  };
  
  const minecraftVersions = [
    '1.21', '1.20.6', '1.20.4', '1.20.1', '1.19.4', '1.19.2', '1.18.2', '1.17.1', '1.16.5', '1.12.2', '1.8.8'
  ];
  
  const serverBuilds = [
    { value: 'paper', label: 'Paper', desc: 'Производительный форк Spigot' },
    { value: 'purpur', label: 'Purpur', desc: 'Расширенный Paper с дополнительными функциями' },
    { value: 'spigot', label: 'Spigot', desc: 'Классическая сборка с плагинами' },
    { value: 'vanilla', label: 'Vanilla', desc: 'Оригинальный сервер Mojang' },
    { value: 'forge', label: 'Forge', desc: 'Для модов' },
    { value: 'fabric', label: 'Fabric', desc: 'Легковесные моды' }
  ];
  
  const handleInstallBuild = () => {
    if (serverStatus !== 'offline') {
      toast.error('Остановите сервер перед установкой');
      return;
    }
    
    setIsInstalling(true);
    const buildName = serverBuilds.find(b => b.value === selectedBuild)?.label || selectedBuild;
    
    setConsoleLines(prev => [
      ...prev,
      {text: `> Installing ${buildName} ${selectedVersion}...`, type: 'command'},
      {text: '[INFO] Downloading server jar...', type: 'log'}
    ]);
    
    setTimeout(() => {
      setConsoleLines(prev => [
        ...prev,
        {text: '[INFO] Download complete!', type: 'log'},
        {text: '[INFO] Configuring server...', type: 'log'}
      ]);
    }, 1500);
    
    setTimeout(() => {
      setConsoleLines(prev => [
        ...prev,
        {text: `[INFO] ${buildName} ${selectedVersion} installed successfully!`, type: 'log'}
      ]);
      setCurrentVersion(`${selectedVersion} ${buildName}`);
      setIsInstalling(false);
      setBuildDialogOpen(false);
      toast.success(`Сборка ${buildName} ${selectedVersion} установлена`);
    }, 3000);
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const maxPlayers = Math.max(...playerData.map(d => d.players));

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Icon name="Server" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">BlazeLegacy</h1>
              <p className="text-sm text-muted-foreground">funworldssezexxz.mcsh.io</p>
            </div>
          </div>
          <Badge 
            variant={serverStatus === 'online' ? 'default' : 'destructive'}
            className={serverStatus === 'online' ? 'bg-accent' : ''}
          >
            {serverStatus === 'online' ? 'Online' : serverStatus === 'starting' ? 'Starting...' : 'Offline'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Button 
            className="h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
            onClick={handleStart}
            disabled={serverStatus !== 'offline'}
          >
            <Icon name="Play" size={20} className="mr-2" />
            ЗАПУСТИТЬ
          </Button>
          <Button 
            className="h-14 text-lg font-semibold bg-secondary hover:bg-secondary/90"
            onClick={handleRestart}
            disabled={serverStatus === 'offline'}
          >
            <Icon name="RotateCw" size={20} className="mr-2" />
            ПЕРЕЗАПУСК
          </Button>
          <Button 
            className="h-14 text-lg font-semibold bg-destructive hover:bg-destructive/90"
            onClick={handleStop}
            disabled={serverStatus === 'offline'}
          >
            <Icon name="Square" size={20} className="mr-2" />
            ВЫКЛЮЧИТЬ
          </Button>
          <Button 
            className="h-14 text-lg font-semibold bg-accent hover:bg-accent/90"
            onClick={() => navigate('/console')}
          >
            <Icon name="Terminal" size={20} className="mr-2" />
            КОНСОЛЬ
          </Button>
          <Button 
            className="h-14 text-lg font-semibold bg-primary/80 hover:bg-primary/70"
            onClick={() => navigate('/files')}
          >
            <Icon name="FolderOpen" size={20} className="mr-2" />
            ФАЙЛЫ
          </Button>
          <Dialog open={buildDialogOpen} onOpenChange={setBuildDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="h-14 text-lg font-semibold bg-secondary/80 hover:bg-secondary/70"
              >
                <Icon name="Package" size={20} className="mr-2" />
                СБОРКА
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Icon name="Package" size={20} />
                  Установка сборки сервера
                </DialogTitle>
                <DialogDescription>
                  Текущая версия: {currentVersion}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Версия Minecraft</Label>
                  <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {minecraftVersions.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Тип сборки</Label>
                  <Select value={selectedBuild} onValueChange={setSelectedBuild}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {serverBuilds.map(build => (
                        <SelectItem key={build.value} value={build.value}>
                          <div className="flex flex-col">
                            <span className="font-semibold">{build.label}</span>
                            <span className="text-xs text-muted-foreground">{build.desc}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted p-3 rounded-lg space-y-1">
                  <p className="text-sm font-medium">Выбрано:</p>
                  <p className="text-sm text-muted-foreground">
                    {serverBuilds.find(b => b.value === selectedBuild)?.label} {selectedVersion}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setBuildDialogOpen(false)}
                  disabled={isInstalling}
                >
                  Отмена
                </Button>
                <Button 
                  className="flex-1 bg-accent hover:bg-accent/90"
                  onClick={handleInstallBuild}
                  disabled={isInstalling}
                >
                  {isInstalling ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Установка...
                    </>
                  ) : (
                    <>
                      <Icon name="Download" size={16} className="mr-2" />
                      Установить
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">VERSION</div>
              <div className="text-lg font-semibold">Paper 1.17.1</div>
              <Button variant="link" className="p-0 h-auto text-primary text-sm">
                <Icon name="Edit" size={14} className="mr-1" />
                CHANGE
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">BALANCE</div>
              <div className="text-lg font-semibold">0 Credits</div>
              <Button variant="link" className="p-0 h-auto text-primary text-sm">
                <Icon name="Plus" size={14} className="mr-1" />
                TOPUP
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">PAUSES IN</div>
              <div className={`text-lg font-semibold ${pauseTime <= 300 ? 'text-destructive' : pauseTime <= 600 ? 'text-yellow-500' : ''}`}>
                {formatTime(pauseTime)}
              </div>
              <div className="flex gap-2">
                <Button variant="link" className="p-0 h-auto text-primary text-sm" onClick={handleRenew}>
                  <Icon name="Clock" size={14} className="mr-1" />
                  RENEW
                </Button>
                <Button variant="link" className="p-0 h-auto text-destructive text-sm">
                  <Icon name="Trash2" size={14} className="mr-1" />
                  DELETE
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Zap" size={20} />
              Bat Tier
              <span className="text-sm font-normal text-muted-foreground ml-2">
                0 Credits per hour
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-sm">Unlimited idle time</span>
              <Badge variant="outline" className="text-xs">Premium plans only</Badge>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">RAM: {ramPlan} GiB</span>
                <Button variant="outline" size="sm">APPLY</Button>
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                {ramOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={ramPlan === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRamPlan(option.value)}
                    className={ramPlan === option.value ? 'bg-primary' : ''}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Icon name="HardDrive" size={16} className="text-muted-foreground" />
                <span>10GiB SSD Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Cpu" size={16} className="text-muted-foreground" />
                <span>200% Burst CPU</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Users" size={20} />
              Online Players
              <span className="text-sm font-normal text-muted-foreground ml-2">
                6h peak: {maxPlayers}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between gap-2">
              {playerData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-secondary rounded-t relative" style={{ height: '100%' }}>
                    {data.players > 0 && (
                      <div 
                        className="absolute bottom-0 w-full bg-accent rounded-t transition-all duration-300"
                        style={{ height: `${(data.players / 5) * 100}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rounded-full" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{data.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Globe" size={20} />
              Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">ADDRESS</div>
              <div className="font-mono text-sm bg-secondary p-2 rounded flex items-center justify-between">
                funworldssezexxz.mcsh.io
                <Icon name="Copy" size={16} className="text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">SHARED IP</div>
              <div className="font-mono text-sm bg-secondary p-2 rounded flex items-center justify-between">
                191.96.231.12:10694
                <Icon name="Copy" size={16} className="text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">EXTRA PORTS</div>
              <Badge variant="outline" className="font-mono">11797</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Database" size={20} className="text-primary" />
                <div className="text-sm text-muted-foreground">MEMORY</div>
              </div>
              <div className="text-2xl font-bold mb-2">{memoryUsage.toFixed(2)} MiB</div>
              <div className="text-sm text-muted-foreground mb-2">of {ramPlan} GiB</div>
              <Progress value={(memoryUsage / (ramPlan * 1024)) * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Cpu" size={20} className="text-primary" />
                <div className="text-sm text-muted-foreground">CPU LOAD</div>
              </div>
              <div className="text-2xl font-bold mb-2">{cpuLoad.toFixed(2)} %</div>
              <div className="text-sm text-muted-foreground mb-2">of 200 %</div>
              <Progress value={cpuLoad / 2} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="HardDrive" size={20} className="text-primary" />
                <div className="text-sm text-muted-foreground">DISK</div>
              </div>
              <div className="text-2xl font-bold mb-2">{diskUsage.toFixed(2)} MiB</div>
              <div className="text-sm text-muted-foreground mb-2">of 10 GiB</div>
              <Progress value={(diskUsage / (10 * 1024)) * 100} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {showConsole && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Terminal" size={20} />
                Console
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={consoleTab} onValueChange={setConsoleTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="all">
                    <Icon name="List" size={16} className="mr-2" />
                    Все ({consoleLines.length})
                  </TabsTrigger>
                  <TabsTrigger value="errors">
                    <Icon name="AlertCircle" size={16} className="mr-2" />
                    Ошибки ({consoleLines.filter(l => l.type === 'error').length})
                  </TabsTrigger>
                  <TabsTrigger value="commands">
                    <Icon name="Terminal" size={16} className="mr-2" />
                    Команды ({consoleLines.filter(l => l.type === 'command').length})
                  </TabsTrigger>
                  <TabsTrigger value="players">
                    <Icon name="Users" size={16} className="mr-2" />
                    Игроки ({consoleLines.filter(l => l.type === 'player').length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={consoleTab} className="mt-0">
                  <div className="bg-black/50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm space-y-1">
                    {filteredLines.map((line, i) => (
                      <div key={i} className={getLineColor(line.type)}>
                        {line.text}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-2 mt-4">
                <input 
                  type="text" 
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
                  placeholder="Type a command..."
                  className="flex-1 bg-secondary border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={handleSendCommand}>
                  <Icon name="Send" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;