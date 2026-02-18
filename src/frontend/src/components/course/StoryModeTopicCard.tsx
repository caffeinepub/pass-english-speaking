import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LessonTopic, VocabularyWord } from '@/lib/course/types';

interface StoryModeTopicCardProps {
  topic: LessonTopic | VocabularyWord;
  icon?: React.ReactNode;
}

export function StoryModeTopicCard({ topic, icon }: StoryModeTopicCardProps) {
  const title = 'word' in topic ? topic.word : topic.title;
  const subtitle = 'meaning' in topic ? topic.meaning : undefined;
  const storyMode = topic.storyMode;

  if (!storyMode) {
    return null;
  }

  return (
    <Card className="border-2 hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <div>
            <div className="text-xl font-bold text-foreground">{title}</div>
            {subtitle && (
              <div className="text-sm font-normal text-muted-foreground mt-1">
                {subtitle}
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Short Story */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-primary">Short Story</h4>
          <p className="text-foreground leading-relaxed">
            {storyMode.shortStory}
          </p>
        </div>

        {/* Real-life Example */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-primary">Real-life Example</h4>
          <p className="text-foreground leading-relaxed">
            {storyMode.realLifeExample}
          </p>
        </div>

        {/* How to use this word */}
        <div className="space-y-2 bg-accent/20 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-primary">How to use this word</h4>
          <p className="text-foreground leading-relaxed">
            {storyMode.howToUseThisWord}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
