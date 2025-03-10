import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Generic API Client Class
class ApiClient<T> {
  private client: AxiosInstance;
  private endpoint: string;

  constructor(
    endpoint: string,
    baseURL: string = import.meta.env.VITE_BACKEND_URL
  ) {
    this.client = axios.create({
      baseURL,
    });
    this.endpoint = endpoint;
  }

  // Fetch all items
  async getAll(config?: AxiosRequestConfig): Promise<T[]> {
    const response = await this.client.get<T[]>(this.endpoint, config);
    return response.data;
  }

  // Fetch a single item by ID
  async getById(id: number | string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(`${this.endpoint}/${id}`, config);
    return response.data;
  }

  // Add a new item
  async create(data: Partial<T>, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(this.endpoint, data, config);
    return response.data;
  }

  // Update an existing item by ID
  async update(
    id: number | string,
    data?: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(
      `${this.endpoint}/${id}`,
      data,
      config
    );
    return response.data;
  }

  // Delete an item by ID
  async delete(config?: AxiosRequestConfig): Promise<void> {
    await this.client.delete(`${this.endpoint}`, config);
  }
}

export default ApiClient;
