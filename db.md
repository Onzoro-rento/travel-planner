# 旅行予定管理アプリ データベース設計書

## 1. 概要

このデータベースは、友人と共有できる旅行予定管理アプリケーションのためのものです。
Supabase（PostgreSQL）を使用し、リアルタイム機能とRow Level Security（RLS）を活用します。

## 2. テーブル一覧

| テーブル名 | 説明 | 主な用途 |
|------------|------|----------|
| users | ユーザー情報（NextAuth管理） | 認証・プロフィール |
| trips | 旅行情報 | 旅行の基本情報管理 |
| trip_members | 旅行参加者 | 旅行への参加管理 |
| schedules | スケジュール | 旅行の詳細スケジュール |
| locations | 場所情報 | 訪問地の詳細情報 |
| messages | チャットメッセージ | 旅行ごとのチャット |
| photos | 写真 | 旅行の写真管理 |
| memos | メモ | 旅行のメモ管理 |
| friends | フレンド関係 | ユーザー間の友達関係 |
| friend_requests | フレンド申請 | 友達申請の管理 |
| notifications | 通知 | システム通知 |

## 3. テーブル詳細設計

### 3.1 users（NextAuth.jsが管理）
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 trips（旅行）
```sql
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'ongoing', 'completed', 'cancelled')),
  cover_image_url TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_trips_start_date ON trips(start_date);
CREATE INDEX idx_trips_created_by ON trips(created_by);
```

### 3.3 trip_members（旅行参加者）
```sql
CREATE TABLE trip_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- インデックス
CREATE INDEX idx_trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX idx_trip_members_user_id ON trip_members(user_id);
```

### 3.4 schedules（スケジュール）
```sql
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES locations(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  order_index INTEGER NOT NULL DEFAULT 0,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_schedules_trip_id ON schedules(trip_id);
CREATE INDEX idx_schedules_scheduled_date ON schedules(scheduled_date);
```

### 3.5 locations（場所）
```sql
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  google_place_id VARCHAR(255),
  place_types TEXT[], -- レストラン、観光地、ホテルなど
  phone VARCHAR(50),
  website TEXT,
  opening_hours JSONB,
  price_level INTEGER CHECK (price_level >= 0 AND price_level <= 4),
  rating DECIMAL(2, 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_locations_google_place_id ON locations(google_place_id);
```

### 3.6 messages（チャットメッセージ）
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'image', 'location', 'schedule')),
  metadata JSONB, -- 画像URL、位置情報など
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_messages_trip_id ON messages(trip_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

### 3.7 photos（写真）
```sql
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  schedule_id UUID REFERENCES schedules(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  taken_at TIMESTAMP WITH TIME ZONE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  file_size INTEGER,
  mime_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_photos_trip_id ON photos(trip_id);
CREATE INDEX idx_photos_schedule_id ON photos(schedule_id);
```

### 3.8 memos（メモ）
```sql
CREATE TABLE memos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  schedule_id UUID REFERENCES schedules(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_memos_trip_id ON memos(trip_id);
```

### 3.9 friends（フレンド関係）
```sql
CREATE TABLE friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- インデックス
CREATE INDEX idx_friends_user_id ON friends(user_id);
CREATE INDEX idx_friends_friend_id ON friends(friend_id);
```

### 3.10 friend_requests（フレンド申請）
```sql
CREATE TABLE friend_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(from_user_id, to_user_id)
);

-- インデックス
CREATE INDEX idx_friend_requests_to_user_id ON friend_requests(to_user_id);
CREATE INDEX idx_friend_requests_status ON friend_requests(status);
```

### 3.11 notifications（通知）
```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

## 4. Row Level Security (RLS) ポリシー

### 4.1 trips テーブルのRLS
```sql
-- 有効化
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- 参加者は旅行を閲覧可能
CREATE POLICY "Members can view trips" ON trips
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trips.id
      AND trip_members.user_id = auth.uid()
      AND trip_members.status = 'accepted'
    )
  );

-- 作成者は旅行を更新可能
CREATE POLICY "Creators can update trips" ON trips
  FOR UPDATE USING (created_by = auth.uid());

-- 認証済みユーザーは旅行を作成可能
CREATE POLICY "Authenticated users can create trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() = created_by);
```

### 4.2 messages テーブルのRLS
```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 旅行参加者はメッセージを閲覧可能
CREATE POLICY "Trip members can view messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = messages.trip_id
      AND trip_members.user_id = auth.uid()
      AND trip_members.status = 'accepted'
    )
  );

-- 旅行参加者はメッセージを投稿可能
CREATE POLICY "Trip members can create messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = messages.trip_id
      AND trip_members.user_id = auth.uid()
      AND trip_members.status = 'accepted'
    )
  );
```

## 5. トリガーとファンクション

### 5.1 updated_at自動更新
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガーを適用
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 5.2 フレンド申請承認時の処理
```sql
CREATE OR REPLACE FUNCTION handle_friend_request_accepted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- 双方向のフレンド関係を作成
    INSERT INTO friends (user_id, friend_id)
    VALUES (NEW.from_user_id, NEW.to_user_id);
    
    INSERT INTO friends (user_id, friend_id)
    VALUES (NEW.to_user_id, NEW.from_user_id);
    
    -- 通知を作成
    INSERT INTO notifications (user_id, type, title, content, data)
    VALUES (
      NEW.from_user_id,
      'friend_request_accepted',
      'フレンド申請が承認されました',
      'フレンド申請が承認されました',
      jsonb_build_object('friend_id', NEW.to_user_id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_friend_request_accepted_trigger
  AFTER UPDATE ON friend_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_friend_request_accepted();
```

## 6. インデックス戦略

### パフォーマンス最適化のためのインデックス
- 外部キーには自動的にインデックスが作成される
- 頻繁に検索される列（日付、ステータス等）にインデックスを追加
- 複合インデックスは検索パターンに応じて追加

## 7. バックアップとメンテナンス

### 推奨事項
1. 日次バックアップの設定
2. 定期的なVACUUM ANALYZE実行
3. インデックスの使用状況モニタリング
4. スロークエリの監視