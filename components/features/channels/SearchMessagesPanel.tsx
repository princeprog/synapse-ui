import { FormEvent, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Message } from '@/lib/types/message.types';
import { messagesService } from '@/services/messages.service';

interface SearchMessagesPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMessage: (messageId: string) => void;
  workspaceSlug: string;
  channelId: string;
}

export function SearchMessagesPanel({
  isOpen,
  onOpenChange,
  onSelectMessage,
  workspaceSlug,
  channelId,
}: SearchMessagesPanelProps) {
  const [keyword, setKeyword] = useState('');
  const [username, setUsername] = useState('');
  const [date, setDate] = useState('');
  const [tag, setTag] = useState('');
  const [results, setResults] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const searchResults = await messagesService.search(
        workspaceSlug,
        channelId,
        {
          keyword,
          username,
          date,
          tag,
        },
      );

      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setKeyword('');
    setUsername('');
    setDate('');
    setTag('');
    setResults([]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Search Messages</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSearch} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Keyword</label>
            <Input
              placeholder="Search message content..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Username</label>
            <Input
              placeholder="Filter by username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tag (e.g., #bug)</label>
            <Input
              placeholder="Filter by tag..."
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSearching}
              className="flex-1"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="flex-1"
            >
              Clear
            </Button>
          </div>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {results.length > 0 ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'No results yet'}
          </p>

          <div className="max-h-[45vh] space-y-2 overflow-y-auto pr-1">
            {results.map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={() => {
                  onSelectMessage(message.id);
                  onOpenChange(false);
                }}
                className="w-full rounded-md border p-2 text-left transition-colors hover:bg-muted/40"
              >
                <p className="text-xs text-muted-foreground">@{message.username}</p>
                <p className="text-sm text-foreground/90">
                  {message.is_deleted ? 'This message is deleted.' : message.content}
                </p>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
