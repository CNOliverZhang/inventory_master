<template>
  <el-dropdown trigger="click" @command="handleChangeLocale">
    <el-button :icon="Coordinate" circle />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="locale in SUPPORT_LOCALES"
          :key="locale.value"
          :command="locale.value"
          :disabled="currentLocale === locale.value"
        >
          <span class="locale-item">
            <span class="flag">{{ locale.flag }}</span>
            <span class="label">{{ locale.label }}</span>
            <el-icon v-if="currentLocale === locale.value" class="check-icon">
              <Check />
            </el-icon>
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/stores/locale'
import { SUPPORT_LOCALES } from '@/locales'
import { Coordinate, Check } from '@element-plus/icons-vue'

const { locale } = useI18n()
const localeStore = useLocaleStore()

const currentLocale = computed(() => locale.value)

const handleChangeLocale = (localeValue: string) => {
  locale.value = localeValue
  localeStore.setLocale(localeValue)
}
</script>

<style scoped lang="scss">
.locale-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;

  .flag {
    font-size: 18px;
  }

  .label {
    flex: 1;
  }

  .check-icon {
    color: #1976d2;
    font-weight: bold;
  }
}
</style>
