import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'FREE',
      price: 'Бесплатно',
      color: 'from-gray-500 to-gray-600',
      features: [
        '1 GB RAM',
        '5 GB SSD',
        'До 5 игроков',
        'Базовая поддержка',
        'Автопауза через 1 час',
        'Только Vanilla сборка'
      ],
      recommended: false
    },
    {
      name: 'PRO',
      price: '45 ₽',
      priceDetail: 'в месяц',
      color: 'from-blue-500 to-blue-600',
      features: [
        '4 GB RAM',
        '20 GB SSD',
        'До 20 игроков',
        'Приоритетная поддержка',
        'Без автопаузы',
        'Все сборки (Paper, Purpur, Forge)',
        'Автобэкапы каждый день'
      ],
      recommended: true
    },
    {
      name: 'DIAMOND',
      price: '123 ₽',
      priceDetail: 'в месяц',
      color: 'from-cyan-500 to-cyan-600',
      features: [
        '8 GB RAM',
        '50 GB SSD',
        'До 50 игроков',
        'VIP поддержка 24/7',
        'Без автопаузы',
        'Все сборки + моды',
        'Автобэкапы каждые 6 часов',
        'Dedиcated IP',
        'DDoS защита'
      ],
      recommended: false
    },
    {
      name: 'ANARCHY',
      price: '1234 ₽',
      priceDetail: 'в месяц',
      color: 'from-red-500 to-red-600',
      features: [
        '16 GB RAM',
        '100 GB NVMe SSD',
        'Неограниченно игроков',
        'Персональный менеджер',
        'Без автопаузы',
        'Все сборки + custom',
        'Автобэкапы каждый час',
        'Dedicated IP + порт',
        'DDoS защита Pro',
        'MySQL база данных',
        'FTP доступ'
      ],
      recommended: false
    }
  ];

  const handleSelectPlan = (planName: string) => {
    if (planName === 'FREE') {
      toast.success('Вы уже используете бесплатный тариф');
    } else {
      toast.info(`Функция оплаты тарифа ${planName} скоро появится`);
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
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Тарифы</h1>
              <p className="text-sm text-muted-foreground">Выберите подходящий план для вашего сервера</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative overflow-hidden ${plan.recommended ? 'border-primary shadow-lg shadow-primary/20' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary">Рекомендуем</Badge>
                </div>
              )}
              <CardHeader>
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Icon name="Server" size={32} className="text-white" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="pt-2">
                  <div className="text-3xl font-bold">{plan.price}</div>
                  {plan.priceDetail && (
                    <div className="text-sm text-muted-foreground">{plan.priceDetail}</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className={`w-full ${plan.recommended ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.recommended ? 'default' : 'outline'}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {plan.name === 'FREE' ? 'Текущий план' : 'Выбрать план'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Info" size={20} />
              Дополнительная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Icon name="Check" size={16} className="text-accent mt-0.5" />
              <span className="text-sm">Все тарифы включают базовую защиту от DDoS атак</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Check" size={16} className="text-accent mt-0.5" />
              <span className="text-sm">Возможность смены тарифа в любой момент</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Check" size={16} className="text-accent mt-0.5" />
              <span className="text-sm">Автоматическое продление подписки (можно отключить)</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Check" size={16} className="text-accent mt-0.5" />
              <span className="text-sm">Техподдержка через Discord и email для всех тарифов</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
