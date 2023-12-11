import { Page } from '@playwright/test'
import * as po from '../search/actions'

export class Search {
  #page: Page

  constructor({ page }: { page: Page }) {
    this.#page = page
  }

  getSearchResultMessage(): Promise<string> {
    return po.getSearchResultMessage({ page: this.#page })
  }

  async selectTagFilter({ tag: string }): Promise<void> {
    await po.selectTagFilter({ tag: string, page: this.#page })
  }

  async selectMediaTypeFilter({ mediaType: string }): Promise<void> {
    await po.selectMediaTypeFilter({ mediaType: string, page: this.#page })
  }

  async selectlastModifiedFilter({ lastModified: string }): Promise<void> {
    await po.selectLastModifiedFilter({ lastModified: string, page: this.#page })
  }

  async clearFilter({ filter: string }): Promise<void> {
    await po.clearFilter({ page: this.#page, filter: string })
  }

  async toggleSearchInFileContent({ enableOrDisable: string }): Promise<void> {
    await po.toggleSearchInFileContent({ enableOrDisable: string, page: this.#page })
  }
}
