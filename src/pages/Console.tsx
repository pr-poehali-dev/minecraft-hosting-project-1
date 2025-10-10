import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Console = () => {
  const navigate = useNavigate();
  const [consoleTab, setConsoleTab] = useState('all');
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleLines, setConsoleLines] = useState<Array<{text: string, type: 'log' | 'error' | 'command' | 'player', time: string}>>([
    {text: 'containerDeceiverHost: server marked as offline', type: 'log', time: '04:13:22'},
    {text: '> Starting server...', type: 'command', time: '04:13:45'},
    {text: 'Server started successfully!', type: 'log', time: '04:13:47'},
    {text: '[INFO] Loading spawn chunks...', type: 'log', time: '04:13:48'},
    {text: '[INFO] Preparing level "world"', type: 'log', time: '04:13:49'},
    {text: 'Player Steve joined the game', type: 'player', time: '04:14:02'},
    {text: '[WARN] Can\'t keep up! Is the server overloaded?', type: 'error', time: '04:14:15'},
    {text: 'Player Alex joined the game', type: 'player', time: '04:14:32'},
    {text: '[INFO] Saving chunks for level \'world\'', type: 'log', time: '04:15:00'},
  ]);

  const handleSendCommand = () => {
    if (!consoleInput.trim()) return;
    
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    setConsoleLines(prev => [...prev, {text: `> ${consoleInput}`, type: 'command', time}]);
    
    setTimeout(() => {
      const responseTime = new Date();
      const responseTimeStr = `${String(responseTime.getHours()).padStart(2, '0')}:${String(responseTime.getMinutes()).padStart(2, '0')}:${String(responseTime.getSeconds()).padStart(2, '0')}`;
      setConsoleLines(prev => [...prev, {text: `Command executed: ${consoleInput}`, type: 'log', time: responseTimeStr}]);
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
              <Icon name="Terminal" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Консоль сервера</h1>
              <p className="text-sm text-muted-foreground">BlazeLegacy</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Icon name="Terminal" size={20} />
                Логи сервера
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setConsoleLines([])}
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Очистить
              </Button>
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
                <div className="bg-black/50 rounded-lg p-4 h-[500px] overflow-y-auto font-mono text-sm space-y-1">
                  {filteredLines.map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-muted-foreground/50 text-xs">{line.time}</span>
                      <span className={getLineColor(line.type)}>
                        {line.text}
                      </span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="BookOpen" size={20} />
                Частые команды
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setConsoleInput('/list');
                  handleSendCommand();
                }}
              >
                <Icon name="Users" size={16} className="mr-2" />
                /list - Список игроков
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setConsoleInput('/stop')}
              >
                <Icon name="Square" size={16} className="mr-2" />
                /stop - Остановить сервер
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setConsoleInput('/save-all')}
              >
                <Icon name="Save" size={16} className="mr-2" />
                /save-all - Сохранить мир
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setConsoleInput('/whitelist list')}
              >
                <Icon name="Shield" size={16} className="mr-2" />
                /whitelist list - Белый список
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Info" size={20} />
                Информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Всего логов</span>
                <span className="font-semibold">{consoleLines.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Ошибок</span>
                <span className="font-semibold text-destructive">
                  {consoleLines.filter(l => l.type === 'error').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Команд выполнено</span>
                <span className="font-semibold text-primary">
                  {consoleLines.filter(l => l.type === 'command').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">События игроков</span>
                <span className="font-semibold text-accent">
                  {consoleLines.filter(l => l.type === 'player').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Console;
