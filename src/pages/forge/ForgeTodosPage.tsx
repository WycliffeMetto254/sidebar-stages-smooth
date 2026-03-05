import { useForgeAuth } from '@/contexts/ForgeAuthContext';
import { useForgeData } from '@/contexts/ForgeDataContext';
import { BUSINESS_ROLE_LABELS } from '@/types/forge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CATEGORY_LABELS: Record<string, string> = {
  'business-model': 'Business Model',
  'market-research': 'Market Research',
  'financial-planning': 'Financial Planning',
  'operations': 'Operations',
  'customer-discovery': 'Customer Discovery',
};

export default function ForgeTodosPage() {
  const { member, squad } = useForgeAuth();
  const { todos, toggleTodo } = useForgeData();

  if (!member || !squad) return null;

  const squadTodos = todos.filter(t => t.squadId === squad.id);
  const myTodos = squadTodos.filter(t => t.memberId === member.id || t.memberId === null);
  const allMembers = squad.members;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Forge To-Do's</h1>
        <p className="text-muted-foreground text-sm">Business-building tasks to prepare you for running a real venture.</p>
      </div>

      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">My Tasks</TabsTrigger>
          <TabsTrigger value="squad">Squad View</TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="space-y-4 mt-4">
          {myTodos.length === 0 && <p className="text-muted-foreground text-sm">No tasks assigned to you yet.</p>}
          {myTodos.map(todo => (
            <Card key={todo.id} className={todo.completed ? 'opacity-60' : ''}>
              <CardContent className="pt-4 flex items-start gap-3">
                <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} className="mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-medium ${todo.completed ? 'line-through' : ''}`}>{todo.title}</p>
                    <Badge variant="outline" className="text-[10px]">{CATEGORY_LABELS[todo.category]}</Badge>
                    <Badge variant="secondary" className="text-[10px]">Day {todo.dueDay}</Badge>
                    {todo.memberId === null && <Badge className="text-[10px] bg-blue-100 text-blue-800">Squad-wide</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{todo.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="squad" className="space-y-6 mt-4">
          {/* Squad-wide tasks */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Squad-wide Tasks</h3>
            <div className="space-y-2">
              {squadTodos.filter(t => t.memberId === null).map(todo => (
                <Card key={todo.id} className={todo.completed ? 'opacity-60' : ''}>
                  <CardContent className="pt-4 flex items-start gap-3">
                    <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${todo.completed ? 'line-through' : ''}`}>{todo.title}</p>
                        <Badge variant="outline" className="text-[10px]">Day {todo.dueDay}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{todo.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Per-member tasks */}
          {allMembers.map(m => {
            const memberTodos = squadTodos.filter(t => t.memberId === m.id);
            if (memberTodos.length === 0) return null;
            return (
              <div key={m.id}>
                <h3 className="font-semibold text-sm mb-3">{m.name} — {BUSINESS_ROLE_LABELS[m.businessRole]}</h3>
                <div className="space-y-2">
                  {memberTodos.map(todo => (
                    <Card key={todo.id} className={todo.completed ? 'opacity-60' : ''}>
                      <CardContent className="pt-4 flex items-start gap-3">
                        <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} className="mt-1" disabled={m.id !== member.id} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm ${todo.completed ? 'line-through' : ''}`}>{todo.title}</p>
                            <Badge variant="outline" className="text-[10px]">{CATEGORY_LABELS[todo.category]}</Badge>
                            <Badge variant="secondary" className="text-[10px]">Day {todo.dueDay}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{todo.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
