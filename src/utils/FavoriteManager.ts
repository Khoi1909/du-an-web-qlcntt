// Favorite tools manager - quản lý localStorage và favorites
export class FavoriteManager {
  private static readonly STORAGE_KEY = 'devtools-favorites';
  private static favorites: Set<string> = new Set();
  private static listeners: Set<(favorites: string[]) => void> = new Set();

  // Khởi tạo từ localStorage
  static init(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const favoriteArray = JSON.parse(stored) as string[];
        this.favorites = new Set(favoriteArray);
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
      this.favorites = new Set();
    }
  }

  // Lưu vào localStorage
  private static save(): void {
    try {
      const favoriteArray = Array.from(this.favorites);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favoriteArray));
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  }

  // Thêm tool vào favorites
  static addFavorite(toolId: string): void {
    if (!this.favorites.has(toolId)) {
      this.favorites.add(toolId);
      this.save();
      this.notifyListeners();
    }
  }

  // Xóa tool khỏi favorites
  static removeFavorite(toolId: string): void {
    if (this.favorites.has(toolId)) {
      this.favorites.delete(toolId);
      this.save();
      this.notifyListeners();
    }
  }

  // Toggle favorite status
  static toggleFavorite(toolId: string): boolean {
    if (this.favorites.has(toolId)) {
      this.removeFavorite(toolId);
      return false; // Not favorite anymore
    } else {
      this.addFavorite(toolId);
      return true; // Now favorite
    }
  }

  // Kiểm tra tool có phải favorite không
  static isFavorite(toolId: string): boolean {
    return this.favorites.has(toolId);
  }

  // Lấy danh sách favorite tool IDs
  static getFavorites(): string[] {
    return Array.from(this.favorites);
  }

  // Lấy số lượng favorites
  static getCount(): number {
    return this.favorites.size;
  }

  // Xóa tất cả favorites
  static clearAll(): void {
    this.favorites.clear();
    this.save();
    this.notifyListeners();
  }

  // Đăng ký listener cho thay đổi favorites
  static addListener(callback: (favorites: string[]) => void): void {
    this.listeners.add(callback);
  }

  // Hủy đăng ký listener
  static removeListener(callback: (favorites: string[]) => void): void {
    this.listeners.delete(callback);
  }

  // Thông báo cho tất cả listeners
  private static notifyListeners(): void {
    const favoriteArray = Array.from(this.favorites);
    this.listeners.forEach(listener => {
      try {
        listener(favoriteArray);
      } catch (error) {
        console.error('Error in favorite listener:', error);
      }
    });
  }

  // Export favorites (để backup)
  static exportFavorites(): string {
    return JSON.stringify(Array.from(this.favorites));
  }

  // Import favorites (từ backup)
  static importFavorites(data: string): void {
    try {
      const favoriteArray = JSON.parse(data) as string[];
      this.favorites = new Set(favoriteArray);
      this.save();
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to import favorites:', error);
    }
  }
}

// Khởi tạo khi module được load
FavoriteManager.init();
